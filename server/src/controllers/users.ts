import { Router, Request, Response, NextFunction } from "express";
import { ensureJWTAuthentication } from "../auth/ensureJWTAuthentication";
import { SearchQuerySchema } from "../../../shared/features/util/models/ISearchQuery";
import { prisma } from "../db/prisma";
import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";
import { IUserSearchedAPISuccess } from "../../../shared/features/users/models/ISearchUserAPISuccess";
import { IUserSearchBar } from "../../../shared/features/users/models/ISearchBarUser";
import { GenerateSupabasePublicURL } from "../services/SupabaseGeneratePublicURL";


export const router = Router();



// router.get("/:searchedUserId", ensureJWTAuthentication, (req: Request<{ searchedUserId: string }>, res: Response, next: NextFunction) => {
    




// });


router.get("/search/:searchQuery", 
    ensureJWTAuthentication, 
    async (req: Request<{ searchQuery: string }>, res: Response<IUserSearchedAPISuccess | ICustomErrorResponse>, next: NextFunction) => {
    const user = req.user!;
    const query = req.query;
    const { searchQuery } = req.params;

    try {
        const { limit, offset } = SearchQuerySchema.parse(query);


        const usersDb = await prisma.user.findMany({
            where: {
                NOT: {
                    id: user.userId
                },
                username: {
                    mode: "insensitive",
                    contains: searchQuery
                }
            },
            take: limit,
            skip: offset,
            include: {
                profileImg: true
            }
        });


        const usersAPI: IUserSearchBar[] = await Promise.all(
            usersDb.map(async (searchedUser): Promise<IUserSearchBar> => {

                let userProfileImgUrl: string | undefined;

                if (searchedUser.profileImg) {
                    const generatePublicUrlResult = await GenerateSupabasePublicURL([searchedUser.profileImg.supabaseFileId]);

                    if (!generatePublicUrlResult.ok) {
                        throw new Error(generatePublicUrlResult.error);
                    }

                    userProfileImgUrl = generatePublicUrlResult.supabasePublicURLs[0];

                }

                return {
                    userId: searchedUser.id,
                    username: searchedUser.username,
                    userProfileImgUrl
                }
            })
        );


        return res.status(200).json({
            ok: true,
            status: 200,
            message: "Received searched users successfully!!!",
            usersSearched: usersAPI
        });


    } catch (error) {

        next(error);


    }


});