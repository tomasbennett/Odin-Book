import { Router, Request, Response, NextFunction } from "express";
import { ensureJWTAuthentication } from "../auth/ensureJWTAuthentication";
import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";
import { HomePostsQuerySchema } from "../../../shared/features/home/models/IHomePostsQuery";
import { Prisma } from "@prisma/client";
import { count } from "console";
import { prisma } from "../db/prisma";
import { IProfilePosts, IProfilePostsAPISuccess } from "../../../shared/features/profiles/models/IProfilePosts";
import { IPost } from "../../../shared/features/posts/models/IPost";
import { generatePostContentAndProfileImage } from "../services/GeneratePostContentAndProfileImage";


export const router = Router();



router.get("/",
    ensureJWTAuthentication,
    async (req: Request, res: Response<IProfilePostsAPISuccess | ICustomErrorResponse>, next: NextFunction) => {

        const user = req.user!;
        const query = req.query;


        try {
            const { offset, limit, sort } = HomePostsQuerySchema.parse(query);

            let postsOrderBy: Prisma.PostOrderByWithRelationInput;

            switch (sort) {
                case "newest":
                    postsOrderBy = {
                        createdAt: "desc"
                    };
                    break;

                case "oldest":
                    postsOrderBy = {
                        createdAt: "asc"
                    };
                    break;

                case "popular":
                    postsOrderBy = {
                        likes: {
                            _count: "desc"
                        },
                        createdAt: "desc"
                    };
                    break;

                default:
                    postsOrderBy = {
                        createdAt: "desc"
                    };
                    break;
            }

            const posts = await prisma.post.findMany({
                take: limit,
                skip: offset,
                orderBy: postsOrderBy,
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




            const homePosts: IProfilePosts = await Promise.all(posts.map(async (post): Promise<IPost> => {


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
                message: "Successfully retrieved posts for home",
                posts: homePosts
            });








            //MAKE IT SO THAT YOU CAN FILTER BY HIGHEST LIKES, NEWEST CREATEDAT OR OLDEST CREATEDAT






        } catch (error) {
            next(error);

        }




    });