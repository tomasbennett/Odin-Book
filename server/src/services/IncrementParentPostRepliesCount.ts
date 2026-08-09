import { Comment, Post, Prisma } from "@prisma/client";
import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";
import { prisma } from "../../lib/prisma";

export async function incrementParentPostRepliesCount(
    parentPostId: string | null
): Promise<{ ok: true } | ICustomErrorResponse> {

    if (!parentPostId) {
        return {
            ok: true
        };
    }


    try {
        
        let postId: string | null = parentPostId;

        while (postId) {
            const post: Post = await prisma.post.update({
                where: { id: postId },
                data: { 
                    descendantRepliesCount: { 
                        increment: 1 
                    } 
                },
            });

            if (!post) {
                return {
                    ok: false,
                    status: 404,
                    message: "Post not found.",
                }
            }

            postId = post.parentPostId;
        }


        return {
            ok: true
        }

    } catch (error: unknown) {

        if (error instanceof Error) {
            return {
                ok: false,
                status: 500,
                message: error.message,
            };
        }

        return {
            ok: false,
            status: 500,
            message: "An unknown error occurred.",
        };
    }

}