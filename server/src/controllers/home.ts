import { Router, Request, Response, NextFunction } from "express";
import { ensureJWTAuthentication } from "../auth/ensureJWTAuthentication";
import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";
import { HomePostsQuerySchema } from "../../../shared/features/home/models/IHomePostsQuery";
import { Prisma } from "@prisma/client";
import { count } from "console";
import { prisma } from "../../lib/prisma";
import { IProfilePosts, IProfilePostsAPISuccess } from "../../../shared/features/profiles/models/IProfilePosts";
import { IPost } from "../../../shared/features/posts/models/IPost";
import { generatePostContentAndProfileImage } from "../services/GeneratePostContentAndProfileImage";
import { sortKeyWord } from "../../../shared/features/posts/constants";
import { postsInclude } from "../constants/postInclude";
import { IProfileRepliesParentPost } from "../../../shared/features/profiles/models/IRepliesParentPost";


export const router = Router();



router.get("/",
    ensureJWTAuthentication,
    async (req: Request, res: Response<IProfilePostsAPISuccess | ICustomErrorResponse>, next: NextFunction) => {

        const user = req.user!;
        const query = req.query;


        try {
            const queryResult = HomePostsQuerySchema.parse(query);

            const sort = queryResult[sortKeyWord];
            const offset = queryResult.offset;
            const limit = queryResult.limit;

            const postsOrderBy: Prisma.PostOrderByWithRelationInput[] = [];

            switch (sort) {
                case "newest":
                    postsOrderBy.push(
                        {
                            createdAt: "desc"
                        },
                        {
                            id: "desc"
                        }
                    );
                    break;

                case "oldest":
                    postsOrderBy.push(
                        {
                            createdAt: "asc"
                        },
                        {
                            id: "desc"
                        }
                    );
                    // postsOrderBy = {
                    //     createdAt: "asc"
                    // };
                    break;

                case "popular":
                    postsOrderBy.push(
                        {
                            likes: {
                                _count: "desc"
                            }
                        },
                        {
                            createdAt: "desc"
                        },
                        {
                            id: "desc"
                        }
                    );
                    // postsOrderBy = {
                    //     likes: {
                    //         _count: "desc"
                    //     },
                    //     createdAt: "desc"
                    // };
                    break;

                default:
                    postsOrderBy.push(
                        {
                            createdAt: "desc"
                        },
                        {
                            id: "desc"
                        }
                    );
                    // postsOrderBy = {
                    //     createdAt: "desc"
                    // };
                    break;
            }

            const posts = await prisma.post.findMany({
                take: limit,
                skip: offset,
                orderBy: postsOrderBy,
                include: {
                    ...postsInclude,
                    parentPost: {
                        include: {
                            user: true
                        }
                    }
                }
            });




            const homePosts: IProfilePosts = await Promise.all(
                posts.map(async (post): Promise<IPost> => {


                    const { userProfileImgUrl, fileDetails } = await generatePostContentAndProfileImage(post);

                    const parentPost: IProfileRepliesParentPost | undefined = 
                        post.parentPost ? {
                            "parentPostId": post.parentPost.id,
                            "parentPostUserId": post.parentPost.userId,
                            "parentPostUsername": post.parentPost.user.username,
                        } : undefined



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
                        haveYouLiked: post.likes.some(like => like.userId === user.userId),
                        parentPost: parentPost
                    }

                })
            );



            return res.status(200).json({
                ok: true,
                status: 200,
                message: "Successfully retrieved posts for home",
                posts: homePosts
            });








            //MAKE IT SO THAT YOU CAN FILTER BY HIGHEST LIKES, NEWEST CREATEDAT OR OLDEST CREATEDAT






        } catch (error) {
            next(error);

        }




    });