import { Router, Request, Response, NextFunction } from "express";
import { ensureJWTAuthentication } from "../auth/ensureJWTAuthentication";
import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";
import { prisma } from "../db/prisma";
import { SearchQuerySchema } from "../../../shared/features/util/models/ISearchQuery";
import { IProfileReplies, IProfileRepliesAPI, IProfileRepliesParentPost } from "../../../shared/features/profiles/models/IProfileReplies";
import { IPost } from "../../../shared/features/posts/models/IPost";
import { generatePostContentAndProfileImage } from "../services/GeneratePostContentAndProfileImage";

export const router = Router();



router.get("/:userId",
    ensureJWTAuthentication,
    async (req: Request<{ userId: string }>, res: Response<IProfileRepliesAPI | ICustomErrorResponse>, next: NextFunction) => {
        //THIS ENDPOINT IS SOLELY FOR THE LOAD MORE ON REPLIES AS THE ORIGINAL BULK OF REPLIES WILL BE LOADED FROM /USERS/:USERID, AND THIS ENDPOINT WILL BE USED TO GET ANY ADDITIONAL REPLIES THAT THE USER HAS MADE, AND WILL BE USED FOR INFINITE SCROLLING BUT NOT HAVING TO LOAD IT ALL IN ONE GO!!!

        const user = req.user!;
        const { userId } = req.params;


        try {
            const { limit, offset } = SearchQuerySchema.parse(req.query);


            const replies = await prisma.post.findMany({
                where: {
                    userId: userId,
                    NOT: {
                        parentPostId: null
                    }
                },
                take: limit,
                skip: offset,
                include: {
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
                    files: true,
                    user: {
                        include: {
                            profileImg: true
                        }
                    },
                    likes: true,
                    comments: true,
                    replies: true
                }
            });




            const profileReplies: IProfileReplies = await Promise.all(
                replies.map(async (reply) => {


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
            )


            return res.status(200).json({
                ok: true,
                status: 200,
                message: "Received specifically replies!!!",
                replies: profileReplies
            });




        } catch (error) {

            next(error);


        }

    });