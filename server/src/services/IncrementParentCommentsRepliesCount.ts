import { Comment, Prisma } from "@prisma/client";
import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";
import { prisma } from "../../lib/prisma";

export async function incrementParentCommentsRepliesCount(
    parentCommentId: string | null,
    postId: string
): Promise<{ ok: true } | ICustomErrorResponse> {
    
    
    try {
        
        const postIncrement = await prisma.post.update({
            where: { id: postId },
            data: {
                descendantCommentsCount: {
                    increment: 1
                }
            }
        });
    
        if (!parentCommentId) {
            return {
                ok: true
            };
        }
        
        let commentId: string | null = parentCommentId;

        while (commentId) {
            const comment: Comment = await prisma.comment.update({
                where: { id: commentId },
                data: { 
                    descendantRepliesCount: { 
                        increment: 1 
                    } 
                },
            });

            if (!comment) {
                return {
                    ok: false,
                    status: 404,
                    message: "Comment not found.",
                }
            }

            commentId = comment.parentCommentId;
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