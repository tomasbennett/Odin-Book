import { Prisma } from "@prisma/client";
import { GenerateSupabasePublicURL } from "./SupabaseGeneratePublicURL";
import { IFileDetails } from "../../../shared/features/files/models/IFileDetails";
import { IPostFileMapping } from "../models/IPostFileMapping";



export async function generatePostContentAndProfileImage(
    post: Prisma.PostGetPayload<{
        include: {
            files: true,
            user: {
                include: {
                    profileImg: true
                }
            }
        }
    }>
): Promise<{
    userProfileImgUrl: string | undefined,
    fileDetails: IFileDetails[] | undefined
}> {


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


    
    return {
        userProfileImgUrl: postUserProfileImgUrl,
        fileDetails
    };




}