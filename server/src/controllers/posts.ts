import { Router, Request, Response, NextFunction } from "express";
import { ensureJWTAuthentication } from "../auth/ensureJWTAuthentication";
import upload from "../supabase/multer";
import { POST_FILE_ARRAY_KEY, SOCKET_EVENT_POST_CREATED, SOCKET_NEW_POST_ROOM_PREFIX } from "../../../shared/features/posts/constants";
import { SearchQuerySchema } from "../../../shared/features/util/models/ISearchQuery";
import { prisma } from "../db/prisma";
import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";
import { IProfilePosts, IProfilePostsAPISuccess } from "../../../shared/features/profiles/models/IProfilePosts";
import { IPost } from "../../../shared/features/posts/models/IPost";
import { generatePostContentAndProfileImage } from "../services/GeneratePostContentAndProfileImage";
import { ICommentsThreadAPIResponse } from "../../../shared/features/commentsThread/models/ICommentsThreadAPI";
import { IPostCommentsThreadAPI } from "../../../shared/features/posts/models/IPostCommentsThread";
import { IComment } from "../../../shared/features/comments/models/IComment";
import { generateCommentContentAndProfileImage } from "../services/GenerateCommentContentAndProfileImage";
import { COMMENT_IMG_GIF_KEY } from "../../../shared/features/comments/constants";
import { CreatePostBackendSchema } from "../models/ICreatePostBackend";
import { ICreatePost } from "../../../shared/features/posts/models/ICreatePost";
import { io } from "../app";
import { IUploadCommentSuccessAPI } from "../../../shared/features/comments/models/IUploadCommentSuccessAPI";
import { IUploadPostSuccessAPI } from "../../../shared/features/posts/models/IUploadPostSuccessAPI";
import { IFileDetails } from "../../../shared/features/files/models/IFileDetails";
import { Files, Prisma } from "@prisma/client";
import { uploadFileToSupabase } from "../services/UploadFileToSupabase";


export const router = Router();


router.get("/:userId",
    ensureJWTAuthentication,
    async (req: Request<{ userId: string }>, res: Response<IProfilePostsAPISuccess | ICustomErrorResponse>, next: NextFunction) => {
        //SO WHILST YOU'LL GET THE ORIGINAL BULK FROM /USERS/:USERID, THIS ENDPOINT WILL BE USED TO GET ANY ADDITIONAL POSTS THAT THE USER HAS MADE, AND WILL BE USED FOR INFINITE SCROLLING BUT NOT HAVING TO LOAD IT ALL IN ONE GO!!!

        const user = req.user!;
        const { userId } = req.params;


        try {
            const { limit, offset } = SearchQuerySchema.parse(req.query);

            const posts = await prisma.post.findMany({
                where: {
                    userId: userId
                },
                orderBy: {
                    createdAt: "desc"
                },
                take: limit,
                skip: offset,
                include: {
                    likes: true,
                    comments: true,
                    replies: true,
                    user: {
                        include: {
                            profileImg: true
                        }
                    },
                    files: true
                }
            });



            const profilePosts: IProfilePosts = await Promise.all(posts.map(async (post): Promise<IPost> => {


                const { userProfileImgUrl, fileDetails } = await generatePostContentAndProfileImage(post);




                return {
                    id: post.id,
                    userId: post.userId,
                    username: post.user.username,
                    createdAt: post.createdAt,
                    title: post.title || undefined,
                    likeCount: post.likes.length,
                    commentCount: post.comments.length,
                    repliesCount: post.replies.length,
                    userProfileImgUrl: userProfileImgUrl,
                    content: post.textContent || undefined,
                    fileDetails: fileDetails,
                }

            }));



            return res.status(200).json({
                ok: true,
                status: 200,
                message: "Successfully retrieved posts for user",
                posts: profilePosts
            });







        } catch (error) {
            next(error);

        }


    });





router.get("/:postId/comments",
    ensureJWTAuthentication,
    async (req: Request<{ postId: string }>, res: Response<IPostCommentsThreadAPI | ICustomErrorResponse>, next: NextFunction) => {

        const { postId } = req.params;
        const user = req.user!;

        try {

            const postDb = await prisma.post.findUnique({
                where: {
                    id: postId
                },
                include: {
                    comments: {
                        where: {
                            parentCommentId: null
                        },
                        orderBy: {
                            createdAt: "desc"
                        },
                        include: {
                            singleGifOrImg: true,
                            replies: true,
                            likes: true,
                            user: {
                                include: {
                                    profileImg: true
                                }
                            }
                        }
                    },
                    likes: true,
                    replies: true,
                    files: true,
                    user: {
                        include: {
                            profileImg: true
                        }
                    }
                }
            });


            if (!postDb) {
                return res.status(404).json({
                    ok: false,
                    status: 404,
                    message: "No post found with this post ID!!!"
                });
            }


            const commentsDb = postDb.comments;




            const buildPost = async () => {
                const { userProfileImgUrl, fileDetails } = await generatePostContentAndProfileImage(postDb);


                const postsApi: IPost = {
                    id: postDb.id,
                    userId: postDb.userId,
                    username: postDb.user.username,
                    userProfileImgUrl,
                    fileDetails,
                    createdAt: postDb.createdAt,
                    likeCount: postDb.likes.length,
                    commentCount: postDb.comments.length,
                    repliesCount: postDb.replies.length,
                    title: postDb.title || undefined,
                    content: postDb.textContent || undefined
                };

                return postsApi;

            }

            const buildComments = async () => {
                const commentsApi: IComment[] = await Promise.all(
                    commentsDb.map(async (comment): Promise<IComment> => {

                        const { userProfileImgUrl: userProfileImgUrlForComment, imgOrGifDetails } = await generateCommentContentAndProfileImage(comment);


                        return {
                            id: comment.id,
                            postId: comment.postId,
                            userId: comment.userId,
                            username: comment.user.username,
                            userProfileImgUrl: userProfileImgUrlForComment,
                            [COMMENT_IMG_GIF_KEY]: imgOrGifDetails,
                            createdAt: comment.createdAt,
                            likeCount: comment.likes.length,
                            commentCount: comment.replies.length,
                            text: comment.textContent || undefined,
                            parentCommentId: undefined
                        }
                    })
                );

                return commentsApi;

            }



            const [postsApi, commentsApi] = await Promise.all([
                buildPost(),
                buildComments()
            ]);






            return res.status(200).json({
                ok: true,
                status: 200,
                message: "Post and comments returned successfully!!!",
                post: postsApi,
                directChildComments: commentsApi
            })




        } catch (error) {
            next(error);

        }



    });


router.post("/",
    ensureJWTAuthentication,
    upload.array(POST_FILE_ARRAY_KEY),
    async (req: Request<{}, {}, ICreatePost>, res: Response<IUploadPostSuccessAPI | ICustomErrorResponse>, next: NextFunction) => {
        //DONT FORGET TO ALLOW IN THE BODY FOR THIS TO BE A REPLY

        const user = req.user!;
        const files = req.files as Express.Multer.File[] | undefined;
        const body = {
            ...req.body,
            [POST_FILE_ARRAY_KEY]: files
        };

        const postBodyResult = CreatePostBackendSchema.safeParse(body);

        if (!postBodyResult.success) {
            const errorMessages = postBodyResult.error.issues.map((err) => err.message).join(", ");

            return res.status(400).json({
                ok: false,
                status: 400,
                message: errorMessages
            });
        }




        try {

            const createdAt = new Date();




            const newPost = await prisma.post.create({
                data: {
                    textContent: body.content,
                    createdAt: createdAt,
                    userId: user.userId,
                    title: body.title
                },
                include: {
                    user: {
                        include: {
                            profileImg: true
                        }
                    }
                }
            })




            let userProfileImgUrl: string | undefined;
            let fileDetails: IFileDetails[] | undefined;

            if (files) {

                const uploadedResult = await Promise.all(
                    files.map(async (file) => {

                        const uploadResult = await uploadFileToSupabase(file);

                        if (!uploadResult.ok) {
                            throw new Error("Something went wrong with one of the file uploads: " + uploadResult.message)
                        }


                        

                        return {
                            // id: newPrismaFile.id,
                            mimetype: file.mimetype,
                            filename: file.filename,
                            filesize: file.size,
                            uploadedAt: createdAt,
                            postContentForId: newPost.id,
                            supabaseFileId: uploadResult.supabaseFileId
                        }


                    })
                );

                const newPrismaFiles = await prisma.files.createManyAndReturn({
                    data: uploadedResult,
                });


                const dbFilesArr = newPrismaFiles;

                const { userProfileImgUrl: userUrl, fileDetails: newPostFileDetails } = await generatePostContentAndProfileImage({
                    ...newPost,
                    files: dbFilesArr
                });


                userProfileImgUrl = userUrl;
                fileDetails = newPostFileDetails;

            }




            const post: IPost = {
                id: newPost.id,
                userId: user.userId,
                username: user.username,
                createdAt,
                likeCount: 0,
                commentCount: 0,
                repliesCount: 0,
                title: newPost.title || undefined,
                content: newPost.textContent || undefined,
                userProfileImgUrl: userProfileImgUrl,
                fileDetails: fileDetails,
            }


            io
                .to(`${SOCKET_NEW_POST_ROOM_PREFIX}:${user.userId}`)
                .except(body.senderSocketId)
                .emit(`${SOCKET_EVENT_POST_CREATED}`, post);


            return res.status(201).json({
                ok: true,
                status: 201,
                message: "Post successfully created!!!",
                post: post
            });




        } catch (error) {
            next(error);

        }



    });


router.delete("/:postId", ensureJWTAuthentication, async (req: Request<{ postId: string }>, res: Response, next: NextFunction) => {

});


router.post("/:postId/like", ensureJWTAuthentication, async (req: Request<{ commentId: string }>, res: Response, next: NextFunction) => {

});

router.post("/:postId/unlike", ensureJWTAuthentication, async (req: Request<{ commentId: string }>, res: Response, next: NextFunction) => {

});