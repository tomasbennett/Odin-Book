import { Prisma } from "@prisma/client";
import { GenerateSupabasePublicURL } from "./SupabaseGeneratePublicURL";
import { IFileDetails } from "../../../shared/features/files/models/IFileDetails";



export async function generateCommentContentAndProfileImage(
    comment: Prisma.CommentGetPayload<{
        include: {
            singleGifOrImg: true,
            user: {
                include: {
                    profileImg: true
                }
            }
        }
    }>
): Promise<{
    userProfileImgUrl: string | undefined,
    imgOrGifDetails: IFileDetails | undefined
}> {



    let userProfileImgUrl: string | undefined;
    let imgOrGifDetails: IFileDetails | undefined;

    const filesToGeneratePublicUrlsForObjMapping: Record<"imgOrGifContent" | "userProfileImg", boolean> = {
        "imgOrGifContent": !!comment.singleGifOrImg,
        "userProfileImg": !!comment.user.profileImg
    };

    const filesToGeneratePublicUrlsFor: string[] = [];

    if (comment.singleGifOrImg) {
        filesToGeneratePublicUrlsFor.push(comment.singleGifOrImg.supabaseFileId);
    }

    if (comment.user.profileImg) {
        filesToGeneratePublicUrlsFor.push(comment.user.profileImg.supabaseFileId);
    }

    const generatedPublicUrlResult = await GenerateSupabasePublicURL(filesToGeneratePublicUrlsFor);

    if (!generatedPublicUrlResult.ok) {
        throw new Error("Failed to generate public URLs for comment or user profile image!!!");
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

    userProfileImgUrl = urlsMapping["userProfileImg"];

    return {
        userProfileImgUrl,
        imgOrGifDetails
    };




}