import { Router, Request, Response, NextFunction } from "express";
import { ensureJWTAuthentication } from "../auth/ensureJWTAuthentication";
import upload from "../supabase/multer";
import { COMMENT_IMG_GIF_KEY, SOCKET_EVENT_COMMENT_CREATED } from "../../../shared/features/comments/constants";
import { SearchQuerySchema } from "../../../shared/features/util/models/ISearchQuery";
import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";
import { prisma } from "../db/prisma";
import { IProfileComments, IProfileCommentsAPI } from "../../../shared/features/profiles/models/IProfileComments";
import { IFileDetails } from "../../../shared/features/files/models/IFileDetails";
import { GenerateSupabasePublicURL } from "../services/SupabaseGeneratePublicURL";
import { getParentComments } from "../services/GetParentCommentsRecursive";
import { ICommentsThreadAPIResponse } from "../../../shared/features/commentsThread/models/ICommentsThreadAPI";
import { IComment } from "../../../shared/features/comments/models/IComment";
import { IPost } from "../../../shared/features/posts/models/IPost";
import { generateCommentContentAndProfileImage } from "../services/GenerateCommentContentAndProfileImage";
import { IPostFileMapping } from "../models/IPostFileMapping";
import { allowedImgTypes } from "../../../shared/features/files/constants";
import { uploadFileToSupabase } from "../services/UploadFileToSupabase";
import { ICreateComment } from "../../../shared/features/comments/models/ICreateComment";
import { CreateCommentBackendSchema, ICreateCommentBackend } from "../models/ICreateCommentBackend";
import { IUploadCommentSuccessAPI } from "../../../shared/features/comments/models/IUploadCommentSuccessAPI";
import { io } from "../app";
import { SOCKET_COMMENT_THREAD_ROOM_PREFIX } from "../../../shared/features/commentsThread/constants";


export const router = Router();

router.get("/:userId", ensureJWTAuthentication, async (req: Request<{ userId: string }>, res: Response<IProfileCommentsAPI | ICustomErrorResponse>, next: NextFunction) => {
    //SO WHILST YOU'LL GET THE ORIGINAL BULK FROM /USERS/:USERID, THIS ENDPOINT WILL BE USED TO GET ANY ADDITIONAL comments THAT THE USER HAS MADE, AND WILL BE USED FOR INFINITE SCROLLING BUT NOT HAVING TO LOAD IT ALL IN ONE GO!!!

    const { limit, offset } = SearchQuerySchema.parse(req.query);

    const { userId } = req.params;
    const user = req.user!;

    try {
        //GET COMMENTS OUT INCLUDING THEIR LIKES AND CONTENT AND ID

        const usersComments = await prisma.comment.findMany({
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
                singleGifOrImg: true,
                user: {
                    include: {
                        profileImg: true
                    }
                },
                post: {
                    include: {
                        user: {
                            include: {
                                profileImg: true
                            }
                        }
                    }
                }
            }
        });


        //THE DIFFICULTY WITHIN TYPES HERE IS BECAUSE OF OBJECT.ENTRIES RETURNING A STRING TYPE NOT A LITERAL TYPE!!!

        const profileCommentDetails: IProfileComments = await Promise.all(
            usersComments.map(async (comment) => {
                const post = comment.post;
                const postUser = post.user;


                let imgOrGifDetails: IFileDetails | undefined;
                let postUserProfileImageUrl: string | undefined;
                let userProfileImgUrl: string | undefined;

                const filesToGeneratePublicUrlsForObjMapping: Record<"imgOrGifContent" | "postUserProfileImg" | "userProfileImg", boolean> = {
                    "imgOrGifContent": !!comment.singleGifOrImg,
                    "postUserProfileImg": !!postUser.profileImg,
                    "userProfileImg": !!comment.user.profileImg
                };



                const filesToGeneratePublicUrlsFor: string[] = [];

                if (comment.singleGifOrImg) {
                    filesToGeneratePublicUrlsFor.push(comment.singleGifOrImg.supabaseFileId);
                }

                if (postUser.profileImg) {
                    filesToGeneratePublicUrlsFor.push(postUser.profileImg.supabaseFileId);
                }


                const generatedPublicUrlResult = await GenerateSupabasePublicURL(filesToGeneratePublicUrlsFor);


                if (!generatedPublicUrlResult.ok) {
                    throw new Error("Failed to generate public URLs for comment or post user profile image!!!");
                }


                let indx = 0;

                const urlsMapping = Object.entries(filesToGeneratePublicUrlsForObjMapping).reduce(
                    (acc, [key, exists]) => {
                        acc[key as keyof typeof filesToGeneratePublicUrlsForObjMapping] =
                            exists
                                ? generatedPublicUrlResult.supabasePublicURLs[indx++]
                                : undefined;

                        return acc;
                    },
                    {} as Record<
                        keyof typeof filesToGeneratePublicUrlsForObjMapping,
                        string | undefined
                    >
                );

                if (comment.singleGifOrImg && urlsMapping["imgOrGifContent"]) {
                    imgOrGifDetails = {
                        id: comment.singleGifOrImg.id,
                        publicUrl: urlsMapping["imgOrGifContent"],
                        name: comment.singleGifOrImg.filename,
                        size: comment.singleGifOrImg.filesize,
                        mimetype: comment.singleGifOrImg.mimetype,
                        createdAt: comment.singleGifOrImg.uploadedAt
                    };
                }

                postUserProfileImageUrl = urlsMapping["postUserProfileImg"];

                userProfileImgUrl = urlsMapping["userProfileImg"];




                return {
                    id: comment.id,
                    postId: post.id,
                    userId: comment.userId,
                    username: comment.user.username,
                    userProfileImgUrl: userProfileImgUrl,
                    createdAt: comment.createdAt,
                    parentCommentId: comment.parentCommentId || undefined,
                    likeCount: comment.likes.length,
                    text: comment.textContent || undefined,
                    imgOrGifDetails: imgOrGifDetails,
                    postUsername: postUser.username,
                    postTitle: post.title || undefined,
                    postUserId: postUser.id,
                    postUserProfileImageUrl: postUserProfileImageUrl
                };
            })
        );





        return res.status(200).json({
            ok: true,
            status: 200,
            message: "Comments found, no guarantee that there are any comments though, so check the length of the array!!!",
            comments: profileCommentDetails
        })








    } catch (error) {
        next(error);

    }



});



router.get("/:commentId/replies", ensureJWTAuthentication, async (req: Request<{ commentId: string }>, res: Response<ICommentsThreadAPIResponse | ICustomErrorResponse>, next: NextFunction) => {
    const user = req.user!;
    const { commentId } = req.params;


    try {

        //MAKE SURE TO GET BOTH THE REPLIES AND THE UPPER PARENT COMMENTS/ORIGINAL POST FOR THIS ONE!!!

        const [replies, comment, parentComments] = await Promise.all([
            prisma.comment.findMany({
                where: {
                    parentCommentId: commentId
                },
                orderBy: {
                    createdAt: "asc"
                },
                include: {
                    likes: true,
                    singleGifOrImg: true,
                    user: {
                        include: {
                            profileImg: true
                        }
                    }
                }
            }),
            prisma.comment.findUnique({
                where: {
                    id: commentId
                },
                include: {
                    post: {
                        include: {
                            user: {
                                include: {
                                    profileImg: true
                                }
                            },
                            likes: true,
                            files: true
                        }
                    },
                    likes: true,
                    singleGifOrImg: true,
                    user: {
                        include: {
                            profileImg: true
                        }
                    }
                }
            }),
            getParentComments(commentId)
        ]);

        if (!comment || !comment.post) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "Comment or post not found!!!"
            });
        }


        const buildReplies = Promise.all(
            replies.map(async (reply): Promise<IComment> => {

                const { userProfileImgUrl, imgOrGifDetails } = await generateCommentContentAndProfileImage(reply);


                return {
                    id: reply.id,
                    postId: reply.postId,
                    userId: reply.userId,
                    username: reply.user.username,
                    userProfileImgUrl: userProfileImgUrl,
                    createdAt: reply.createdAt,
                    parentCommentId: commentId,
                    likeCount: reply.likes.length,
                    text: reply.textContent || undefined,
                    [COMMENT_IMG_GIF_KEY]: imgOrGifDetails
                }
            })
        );

        const buildParentComments = Promise.all(
            parentComments.map(async (parentComment): Promise<IComment> => {

                const { userProfileImgUrl, imgOrGifDetails } = await generateCommentContentAndProfileImage(parentComment);

                return {
                    id: parentComment.id,
                    postId: parentComment.postId,
                    userId: parentComment.userId,
                    username: parentComment.user.username,
                    userProfileImgUrl: userProfileImgUrl,
                    createdAt: parentComment.createdAt,
                    parentCommentId: parentComment.parentCommentId || undefined,
                    likeCount: parentComment.likes.length,
                    text: parentComment.textContent || undefined,
                    [COMMENT_IMG_GIF_KEY]: imgOrGifDetails
                }
            })
        );

        const buildComment = async () => {
            const { userProfileImgUrl, imgOrGifDetails } = await generateCommentContentAndProfileImage(comment);

            const commentAPI: IComment = {
                id: comment.id,
                postId: comment.postId,
                userId: comment.userId,
                username: comment.user.username,
                userProfileImgUrl: userProfileImgUrl,
                createdAt: comment.createdAt,
                parentCommentId: comment.parentCommentId || undefined,
                likeCount: comment.likes.length,
                text: comment.textContent || undefined,
                [COMMENT_IMG_GIF_KEY]: imgOrGifDetails
            };

            return commentAPI;
        }

        const buildPost = async () => {
            const post = comment.post;

            //SO POST CAN HAVE MULTIPLE FILES BEING THE ONLY REAL DIFFERENCE IN THE CONTENT AREA

            let postUserProfileImgUrl: string | undefined;
            let fileDetails: IFileDetails[] | undefined;

            const filesToGeneratePublicUrlsFor: string[] = [];
            const mapping: IPostFileMapping = {};

            if (post.user.profileImg) {
                mapping.postUserProfileImg = filesToGeneratePublicUrlsFor.length;

                filesToGeneratePublicUrlsFor.push(post.user.profileImg.supabaseFileId);
            }

            if (post.files.length > 0) {
                mapping.postContentFiles = {
                    start: filesToGeneratePublicUrlsFor.length,
                    count: post.files.length
                };

                post.files.forEach((file) => {
                    filesToGeneratePublicUrlsFor.push(file.supabaseFileId);
                });
            }

            const generatedPublicUrlResult = await GenerateSupabasePublicURL(filesToGeneratePublicUrlsFor);

            if (!generatedPublicUrlResult.ok) {
                throw new Error("Failed to generate public URLs for post or post user profile image!!!");
            }

            if (mapping.postUserProfileImg !== undefined) {
                postUserProfileImgUrl = generatedPublicUrlResult.supabasePublicURLs[
                    mapping.postUserProfileImg
                ];
            }

            if (mapping.postContentFiles) {
                const { start, count } = mapping.postContentFiles;

                fileDetails = post.files.map((file, i) => ({
                    id: file.id,
                    publicUrl:
                        generatedPublicUrlResult.supabasePublicURLs[start + i],
                    name: file.filename,
                    size: file.filesize,
                    mimetype: file.mimetype,
                    createdAt: file.uploadedAt
                }));
            }



            const postAPI: IPost = {
                id: post.id,
                userId: post.userId,
                username: post.user.username,
                title: post.title || undefined,
                content: post.textContent || undefined,
                createdAt: post.createdAt,
                likeCount: post.likes.length,
                userProfileImgUrl: postUserProfileImgUrl,
                fileDetails: fileDetails,
            };

            return postAPI;
        }


        const [repliesAPI, parentCommentsAPI, commentAPI, postAPI] = await Promise.all([
            buildReplies,
            buildParentComments,
            buildComment(),
            buildPost()
        ]);



        return res.status(200).json({
            ok: true,
            status: 200,
            message: "Replies and parent comments fetched successfully!!!",
            replies: repliesAPI,
            comment: commentAPI,
            post: postAPI,
            parentComments: parentCommentsAPI
        });






    } catch (error) {
        next(error);

    }


});


router.post(
    "/",
    ensureJWTAuthentication,
    upload.single(COMMENT_IMG_GIF_KEY),
    async (req: Request<{}, {}, ICreateComment>, res: Response<IUploadCommentSuccessAPI | ICustomErrorResponse>, next: NextFunction) => {

        const user = req.user!;
        const file = req.file;
        const body = {
            ...req.body,
            [COMMENT_IMG_GIF_KEY]: file || undefined
        };

        const commentBodyResult = CreateCommentBackendSchema.safeParse(body);

        if (!commentBodyResult.success) {
            const errorMessages = commentBodyResult.error.issues.map((err) => err.message).join(", ");

            return res.status(400).json({
                ok: false,
                status: 400,
                message: errorMessages
            });
        }

        try {
            const createdAt = new Date();


            let prismaSingleImgOrGifFileId: string | undefined;
            let supabaseSingleImgOrGifFileId: string | undefined;

            if (file) {
                const fileResult = await uploadFileToSupabase(file);

                if (!fileResult.ok) {
                    return res.status(fileResult.status).json(fileResult);
                }

                const prismaFile = await prisma.files.create({
                    data: {
                        filename: file.filename,
                        filesize: file.size,
                        mimetype: file.mimetype,
                        supabaseFileId: fileResult.supabaseFileId,
                        uploadedAt: createdAt
                    }
                });

                prismaSingleImgOrGifFileId = prismaFile.id;

                supabaseSingleImgOrGifFileId = fileResult.supabaseFileId;

            }

            const uploadedComment = await prisma.comment.create({
                data: {
                    userId: user.userId,
                    textContent: req.body.content || undefined,
                    parentCommentId: req.body.parentCommentId || undefined,
                    postId: req.body.postId,
                    createdAt: createdAt,
                    singleGifOrImgId: prismaSingleImgOrGifFileId || undefined
                },
                include: {
                    singleGifOrImg: true,
                    user: {
                        include: {
                            profileImg: true
                        }
                    },
                }
            });

            //NEED TO SEE ABOUT GETTING PUBLIC URL IF NECESSARY FOR ANYTHING TO SEND OUT TO THE SOCKETS, CHECK MESSAGING APP

            const { userProfileImgUrl, imgOrGifDetails } = await generateCommentContentAndProfileImage(uploadedComment);



            //NEED TO FIND A WAY TO SEND THIS TO EVERYONE IN THE ROOM EXCEPT THIS CURRENT USER!!!

            const apiComment: IComment = {
                id: uploadedComment.id,
                postId: uploadedComment.postId,
                userId: uploadedComment.userId,
                username: uploadedComment.user.username,
                userProfileImgUrl: userProfileImgUrl,
                createdAt: uploadedComment.createdAt,
                parentCommentId: uploadedComment.parentCommentId || undefined,
                likeCount: 0,
                text: uploadedComment.textContent || undefined,
                [COMMENT_IMG_GIF_KEY]: imgOrGifDetails
            };

            io
                .to(`${SOCKET_COMMENT_THREAD_ROOM_PREFIX}:${apiComment.parentCommentId}`)
                .except(body.senderSocketId)
                .emit(`${SOCKET_EVENT_COMMENT_CREATED}`, apiComment);






            return res.status(201).json({
                ok: true,
                status: 201,
                message: "Comment uploaded successfully!!!",
                comment: apiComment
            });


        } catch (error) {
            next(error);

        }




    });


router.delete("/:commentId", ensureJWTAuthentication, async (req: Request<{ commentId: string }>, res: Response, next: NextFunction) => {

});



router.post("/:commentId/like", ensureJWTAuthentication, async (req: Request<{ commentId: string }>, res: Response, next: NextFunction) => {

});

router.post("/:commentId/unlike", ensureJWTAuthentication, async (req: Request<{ commentId: string }>, res: Response, next: NextFunction) => {

});