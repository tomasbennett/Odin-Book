import { postsInclude } from "../constants/postInclude";
import { prisma } from "../../lib/prisma";

export async function getParentPosts(postId: string) {
    const parentPosts = [];

    let currentPost = await prisma.post.findUnique({
        where: {
            id: postId
        }
    });

    while (currentPost?.parentPostId) {
        const parent = await prisma.post.findUnique({
            where: {
                id: currentPost.parentPostId
            },
            include: postsInclude
        });

        if (!parent) break;

        parentPosts.push(parent);

        currentPost = parent;
    }

    return parentPosts.reverse();
}