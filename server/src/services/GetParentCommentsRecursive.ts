import { IComment } from "../../../shared/features/comments/models/IComment";
import { prisma } from "../db/prisma";

export async function getParentComments(commentId: string) {
    const parentComments = [];

    let currentComment = await prisma.comment.findUnique({
        where: {
            id: commentId
        }
    });

    while (currentComment?.parentCommentId) {
        const parent = await prisma.comment.findUnique({
            where: {
                id: currentComment.parentCommentId
            },
            include: {
                likes: true,
                singleGifOrImg: true,
                user: {
                    include: {
                        profileImg: true
                    }
                }
            }
        });

        if (!parent) break;

        parentComments.push(parent);

        currentComment = parent;
    }

    return parentComments.reverse();
}