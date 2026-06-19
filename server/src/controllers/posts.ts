import { Router, Request, Response, NextFunction } from "express";
import { ensureJWTAuthentication } from "../auth/ensureJWTAuthentication";
import upload from "../supabase/multer";
import { POST_FILE_ARRAY_KEY, SOCKET_EVENT_POST_OR_REPLY_CREATED, SOCKET_EVENT_POST_OR_REPLY_DELETED, SOCKET_NEW_POST_OR_REPLY_ROOM_PREFIX } from "../../../shared/features/posts/constants";
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
import { IDeletePost } from "../../../shared/features/posts/models/IDeletePost";
import { SOCKET_COMMENT_POST_IS_VISIBLE_ROOM_PREFIX } from "../../../shared/features/commentsThread/constants";
import { IDeletePostSuccessAPI } from "../../../shared/features/posts/models/IDeletePostSuccessAPI";
import { ISuccessUploadLikePost } from "../../../shared/features/likes/models/ISuccessUploadLikePost";
import { ISendLikePost } from "../../../shared/features/likes/models/ISendLikePost";
import { SOCKET_LIKE_POST_EVENT, SOCKET_UNLIKE_POST_EVENT } from "../../../shared/features/likes/constants";
import { ILikePostAPISuccess } from "../../../shared/features/likes/models/ILikePostAPISuccess";
import { IProfileRepliesParentPost } from "../../../shared/features/profiles/models/IProfileReplies";


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
                    title: body.title,
                    parentPostId: body.parentPostId
                },
                include: {
                    user: {
                        include: {
                            profileImg: true
                        }
                    },
                    parentPost: {
                        include: {
                            user: {
                                include: {
                                    profileImg: true
                                }
                            },
                            files: true
                        }
                    }
                }
            });






            const buildPost = async () => {

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


                return post;
            }

            const buildParentPost = async () => {
                if (!newPost.parentPost) {
                    return undefined;
                }

                const parentPost = newPost.parentPost;

                const { userProfileImgUrl: parentPostUserProfileImgUrl, fileDetails: parentPostFileDetails } = await generatePostContentAndProfileImage(newPost.parentPost);

                const parentPostDetails: IProfileRepliesParentPost = {
                    parentPostId: parentPost.id,
                    parentPostUserId: parentPost.userId,
                    parentPostUsername: parentPost.user.username,
                    parentPostTitle: parentPost.title || undefined,
                    content: parentPost.textContent || undefined,
                    parentPostUserImgUrl: parentPostUserProfileImgUrl,
                    fileDetails: parentPostFileDetails
                }

                return parentPostDetails;

            }


            const [post, parentPost] = await Promise.all([
                buildPost(),
                buildParentPost()
            ]);


            const successfulPostResponse: IPost = {
                ...post,
                parentPost: parentPost
            }


            io
                .to(`${SOCKET_NEW_POST_OR_REPLY_ROOM_PREFIX}:${user.userId}`)
                .except(body.senderSocketId)
                .emit(`${SOCKET_EVENT_POST_OR_REPLY_CREATED}`, successfulPostResponse);


            return res.status(201).json({
                ok: true,
                status: 201,
                message: "Post successfully created!!!",
                post: successfulPostResponse
            });




        } catch (error) {
            next(error);

        }



    });


router.delete("/:postId",
    ensureJWTAuthentication,
    async (req: Request<{ postId: string }, {}, IDeletePost>, res: Response<ICustomErrorResponse>, next: NextFunction) => {
        const user = req.user!;
        const { postId } = req.params;
        const { senderSocketId } = req.body;


        try {

            const postToBeDeleted = await prisma.post.findUnique({
                where: {
                    id: postId,
                    userId: user.userId
                },
            });

            if (!postToBeDeleted) {
                return res.status(400).json({
                    ok: false,
                    status: 400,
                    message: "Could not find post with this ID or is not your post to delete!!!"
                });
            }

            const deletedPost = await prisma.post.delete({
                where: {
                    id: postId
                }
            });

            const deletedPostAPI: IDeletePostSuccessAPI = {
                postId
            }

            io
                .to(`${SOCKET_COMMENT_POST_IS_VISIBLE_ROOM_PREFIX}:${postId}`)
                .except(senderSocketId)
                .emit(`${SOCKET_EVENT_POST_OR_REPLY_DELETED}`, deletedPostAPI);



            return res.sendStatus(204);



        } catch (error) {
            next(error);

        }




    });


router.post("/:postId/like",
    ensureJWTAuthentication,
    async (req: Request<{ postId: string }, {}, ISendLikePost>, res: Response<ILikePostAPISuccess | ICustomErrorResponse>, next: NextFunction) => {
        const user = req.user!;
        const { postId } = req.params;
        const { senderSocketId } = req.body;

        try {

            const hasUserLikedPost = await prisma.userLikes.findUnique({
                where: {
                    unique_user_post: {
                        userId: user.userId,
                        postId: postId
                    }
                }
            });


            if (hasUserLikedPost) {
                return res.status(401).json({
                    ok: false,
                    status: 400,
                    message: "You have already liked this post!!!"
                });
            }

            const createdAt = new Date();

            const likePost = await prisma.userLikes.create({
                data: {
                    userId: user.userId,
                    postId,
                    createdAt
                }
            });


            const successResponse: ISuccessUploadLikePost = {
                postId: postId
            }

            io
                .to(`${SOCKET_COMMENT_POST_IS_VISIBLE_ROOM_PREFIX}:${postId}`)
                .except(senderSocketId)
                .emit(`${SOCKET_LIKE_POST_EVENT}`, successResponse);



            return res.status(201).json({
                ok: true,
                status: 201,
                message: "Successfully liked post!!!",
                postId
            });









        } catch (error) {
            next(error);

        }



    });



    
router.patch("/:postId/unlike",
    ensureJWTAuthentication,
    async (req: Request<{ postId: string }, {}, ISendLikePost>, res: Response<ILikePostAPISuccess | ICustomErrorResponse>, next: NextFunction) => {
        const user = req.user!;
        const { postId } = req.params;
        const { senderSocketId } = req.body;


        try {

            const hasUserLikedPost = await prisma.userLikes.findUnique({
                where: {
                    unique_user_post: {
                        userId: user.userId,
                        postId: postId
                    }
                }
            });


            if (!hasUserLikedPost) {
                return res.status(401).json({
                    ok: false,
                    status: 400,
                    message: "You haven't liked this post!!!"
                });
            }

            const likePost = await prisma.userLikes.delete({
                where: {
                    unique_user_post: {
                        userId: user.userId,
                        postId,
                    }
                }
            });


            const successResponse: ISuccessUploadLikePost = {
                postId: postId
            }

            io
                .to(`${SOCKET_COMMENT_POST_IS_VISIBLE_ROOM_PREFIX}:${postId}`)
                .except(senderSocketId)
                .emit(`${SOCKET_UNLIKE_POST_EVENT}`, successResponse);



            return res.status(201).json({
                ok: true,
                status: 201,
                message: "Successfully removed like from post!!!",
                postId
            });





        } catch (error) {
            next(error);


        }




    });