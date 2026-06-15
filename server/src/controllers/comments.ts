import { Router, Request, Response, NextFunction } from "express";
import { ensureJWTAuthentication } from "../auth/ensureJWTAuthentication";
import upload from "../supabase/multer";
import { COMMENT_IMG_GIF_KEY } from "../../../shared/features/comments/constants";
import { SearchQuerySchema } from "../../../shared/features/util/models/ISearchQuery";
import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";
import { prisma } from "../db/prisma";
import { IProfileComments, IProfileCommentsAPI } from "../../../shared/features/profiles/models/IProfileComments";
import { IFileDetails } from "../../../shared/features/files/models/IFileDetails";
import { GenerateSupabasePublicURL } from "../services/SupabaseGeneratePublicURL";


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



router.get("/:commentId/replies", ensureJWTAuthentication, (req: Request<{ commentId: string }>, res: Response, next: NextFunction) => {

});


router.post("/", ensureJWTAuthentication, upload.single(COMMENT_IMG_GIF_KEY), async (req: Request, res: Response, next: NextFunction) => {

});


router.delete("/:commentId", ensureJWTAuthentication, async (req: Request<{ commentId: string }>, res: Response, next: NextFunction) => {

});



router.post("/:commentId/like", ensureJWTAuthentication, async (req: Request<{ commentId: string }>, res: Response, next: NextFunction) => {

});

router.post("/:commentId/unlike", ensureJWTAuthentication, async (req: Request<{ commentId: string }>, res: Response, next: NextFunction) => {

});