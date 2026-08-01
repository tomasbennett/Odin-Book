import { Prisma } from "@prisma/client";

export const postsInclude = {
    likes: true,
    comments: true,
    replies: true,
    user: {
        include: {
            profileImg: true
        }
    },
    postFileContent: {
        include: {
            file: true
        }
    }
} satisfies Prisma.PostInclude;
