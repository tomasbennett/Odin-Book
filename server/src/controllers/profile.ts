import { Router, Request, Response, NextFunction } from "express";
import { ensureJWTAuthentication } from "../auth/ensureJWTAuthentication";
import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";
import { prisma } from "../db/prisma";
import { IProfileAPISuccess } from "../../../shared/features/profiles/models/IProfileAPI";
import { IProfileHeader } from "../../../shared/features/profiles/models/IProfileHeader";
import { IProfilePosts } from "../../../shared/features/profiles/models/IProfilePosts";
import { IProfileReplies, IProfileRepliesParentPost } from "../../../shared/features/profiles/models/IProfileReplies";
import { IProfileComments } from "../../../shared/features/profiles/models/IProfileComments";
import { IPost } from "../../../shared/features/posts/models/IPost";
import { generatePostContentAndProfileImage } from "../services/GeneratePostContentAndProfileImage";
import { GenerateSupabasePublicURL } from "../services/SupabaseGeneratePublicURL";
import { IFileDetails } from "../../../shared/features/files/models/IFileDetails";




export const router = Router();




router.get("/:userId",
    ensureJWTAuthentication,
    async (req: Request, res: Response<IProfileAPISuccess | ICustomErrorResponse>, next: NextFunction) => {
        const user = req.user!;
        const { userId } = req.params;

        const limitPost: number = 10;
        const limitReplies: number = 10;
        const limitComments: number = 20;



        try {

            const [userHeaderInfoDb, postsDb, repliesDb, commentsDb] = await prisma.$transaction([
                prisma.user.findUnique({
                    where: {
                        id: userId
                    },
                    include: {
                        profileImg: true,
                        accountBackgroundImg: true
                    }
                }),
                prisma.post.findMany({
                    where: {
                        userId: userId,
                        parentPostId: null
                    },
                    take: limitPost,
                    orderBy: {
                        createdAt: "desc"
                    },
                    include: {
                        likes: true,
                        comments: true,
                        replies: true,
                        files: true,
                        user: {
                            include: {
                                profileImg: true
                            }
                        }
                    }
                }),
                prisma.post.findMany({
                    where: {
                        userId: userId,
                        NOT: {
                            parentPostId: null
                        }
                    },
                    take: limitReplies,
                    orderBy: {
                        createdAt: "desc"
                    },
                    include: {
                        likes: true,
                        comments: true,
                        replies: true,
                        user: {
                            include: {
                                profileImg: true
                            }
                        },
                        files: true,
                        parentPost: {
                            include: {
                                files: true,
                                user: {
                                    include: {
                                        profileImg: true
                                    }
                                }
                            }
                        },
                    }
                }),
                prisma.comment.findMany({
                    where: {
                        userId: userId
                    },
                    take: limitComments,
                    orderBy: {
                        createdAt: "desc"
                    },
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
                        },
                        replies: true
                    }
                })
            ]);


            if (!userHeaderInfoDb) {
                return res.status(400).json({
                    ok: false,
                    status: 400,
                    message: "Unable to find user with this ID!!!"
                });
            }



            //SO WHAT I WANT TO DO IS GENERATE A PUBLIC LINK FOR BOTH IMAGES AT THE SAME TIME BUT BOTH MIGHT BE UNDEFINED AT ANY GIVEN TIME

            const buildingUserHeaderInfo = async () => {

                const filesToGeneratePublicUrlsFor: string[] = [];
                const mapping: {
                    userProfileImg?: number | undefined;
                    backgroundImg?: number | undefined
                } = {}
    
                if (userHeaderInfoDb.profileImg) {
    
                    mapping.userProfileImg = filesToGeneratePublicUrlsFor.length;
    
    
                    filesToGeneratePublicUrlsFor.push(userHeaderInfoDb.profileImg.supabaseFileId);
                }
    
                if (userHeaderInfoDb.accountBackgroundImg) {
                    mapping.userProfileImg = filesToGeneratePublicUrlsFor.length;
    
    
                    filesToGeneratePublicUrlsFor.push(userHeaderInfoDb.accountBackgroundImg.supabaseFileId);
                }
    
                const generatedResult = await GenerateSupabasePublicURL(filesToGeneratePublicUrlsFor);
    
                if (!generatedResult.ok) {
                    throw new Error(generatedResult.error);
                }
    
    
    
                let publicUserProfileImg: string | undefined;
    
                if (mapping.userProfileImg !== undefined) {
                    publicUserProfileImg = generatedResult.supabasePublicURLs[mapping.userProfileImg];
    
                }
    
    
                let publicBackgroundImg: string | undefined;
    
                if (mapping.backgroundImg !== undefined) {
                    publicBackgroundImg = generatedResult.supabasePublicURLs[mapping.backgroundImg];
    
                }
    
    
    
                const userHeaderInfoAPI: IProfileHeader = {
                    userId,
                    username: userHeaderInfoDb.username,
                    accountCreatedAt: userHeaderInfoDb.createdAt,
                    aboutUser: userHeaderInfoDb.aboutMe || undefined,
                    userProfileImg: publicUserProfileImg,
                    accountBackgroundImg: publicBackgroundImg,
                }
    
                return userHeaderInfoAPI;
                
            }

            const buildingPosts = async () => {
                const postsAPI: IProfilePosts = await Promise.all(
                    postsDb.map(async (post): Promise<IPost> => {
    
                        const { userProfileImgUrl, fileDetails } = await generatePostContentAndProfileImage(post);
    
    
    
                        return {
                            id: post.id,
                            userId: post.userId,
                            username: post.user.username,
                            userProfileImgUrl,
                            fileDetails,
                            createdAt: post.createdAt,
                            likeCount: post.likes.length,
                            commentCount: post.comments.length,
                            repliesCount: post.replies.length,
                            title: post.title || undefined,
                            content: post.textContent || undefined
                        }
    
    
                    })
                );

                return postsAPI;

            }


            const buildingReplies = async () => {
                const repliesAPI: IProfileReplies = await Promise.all(
                    repliesDb.map(async (reply) => {
                        const buildParenPostDetails = async (): Promise<IProfileRepliesParentPost> => {
                            const parentPostDb = reply.parentPost!;
    
                            const { userProfileImgUrl: parentUserProfileImgUrl, fileDetails: parentFileDetails } =
                                await generatePostContentAndProfileImage(parentPostDb); //THIS IS DONE BECAUSE WE SHOULD ONLY BE SELECTING REPLIES WITH PARENT POSTS!!!
    
                            const parentPost: IProfileRepliesParentPost = {
                                parentPostId: parentPostDb.id,
                                parentPostUserId: parentPostDb.userId,
                                parentPostTitle: parentPostDb.title || undefined,
                                parentPostUserImgUrl: parentUserProfileImgUrl,
                                parentPostUsername: parentPostDb.user.username,
                                fileDetails: parentFileDetails,
                                content: parentPostDb.textContent || undefined
                            }
    
                            return parentPost
                        }
    
                        const buildReplyDetails = async (): Promise<IPost> => {
                            const { userProfileImgUrl: replyUserProfileImg, fileDetails: replyFileDetails } =
                                await generatePostContentAndProfileImage(reply);
    
                            const profileReply: IPost = {
                                id: reply.id,
                                userId: reply.userId,
                                username: reply.user.username,
                                userProfileImgUrl: replyUserProfileImg,
                                createdAt: reply.createdAt,
                                likeCount: reply.likes.length,
                                commentCount: reply.comments.length,
                                repliesCount: reply.replies.length,
                                title: reply.title || undefined,
                                content: reply.textContent || undefined,
                                fileDetails: replyFileDetails
                            }
    
                            return profileReply;
                        }
    
    
    
                        const [parentPost, profileReply]: [IProfileRepliesParentPost, IPost] = await Promise.all([
                            buildParenPostDetails(),
                            buildReplyDetails()
                        ]);
    
    
                        return {
                            ...parentPost,
                            ...profileReply
                        }
                    })
                );

                return repliesAPI;
            }
            

            const buildingComments = async () => {
                const commentsAPI: IProfileComments = await Promise.all(
                    commentsDb.map(async (comment) => {
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
                            postUserProfileImageUrl: postUserProfileImageUrl,
                            commentCount: comment.replies.length
                        };
                    })
                );

                return commentsAPI;

            }


            const [userHeaderInfoAPI, repliesAPI, postsAPI, commentsAPI] = await Promise.all([
                buildingUserHeaderInfo(),
                buildingReplies(),
                buildingPosts(),
                buildingComments()
            ]);




            return res.status(200).json({
                ok: true,
                status: 200,
                message: "Receiving full profile information!!!",
                headerInfo: userHeaderInfoAPI,
                replies: repliesAPI,
                posts: postsAPI,
                comments: commentsAPI
            });



        } catch (error) {
            next(error);

        }


    });




router.patch("/", 
    ensureJWTAuthentication,
    async (req: Request<{}, {}, >, res: Response<ICustomErrorResponse>, next: NextFunction) => {
        
        const user = req.user!;


        try {







            
        } catch (error) {

            next(error);


        }







    });