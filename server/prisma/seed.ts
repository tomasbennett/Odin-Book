import { Comment, Files, Post, Prisma, PrismaClient, User } from '@prisma/client';

// import "dotenv/config";
import dotenv from "dotenv";
dotenv.config({
    path: "../.env"
});
import bcrypt from "bcrypt";
import mime from "mime-types";
import path from "path";
import fs from "fs/promises";
import { faker } from "@faker-js/faker";
import { supabase } from '../lib/client';
import { randomItemFromArray } from '../../shared/features/util/services/randomItemFromArray';
import { randomInt } from '../../shared/features/util/services/randomIntegerMinMax';

// //AT THE END TEST IF YOU CAN IMPORT FROM THE SHARED FOLDER THROUGH A SEPARATE TSCONFIG.JSON FILE IN PRISMA FOLDER AND THEN ADD TO THE SEED COMMAND IN PACKAGE.JSON FILE
const prisma = new PrismaClient();


const ASSETS_DIR = path.join(
    "C:",
    "Users",
    "tjsbe",
    "development",
    "seed_assets",
);

const IMAGES_DIR = path.join(
    ASSETS_DIR,
    "images"
);

const TEXT_FILES_DIR = path.join(
    ASSETS_DIR,
    "text"
);







// const posts: Prisma.PostCreateInput[] = [];
// const directPostReplies: Prisma.PostCreateInput[] = [];
// const secondLayerPostReplies: Prisma.PostCreateInput[] = [];

// const comments: Prisma.CommentCreateInput[] = [];
// const directCommentReplies: Prisma.CommentCreateInput[] = [];
// const secondLayerCommentReplies: Prisma.CommentCreateInput[] = [];






// async function buildDefaultValues(): Promise<Prisma.UserCreateInput[]> {
//     const saltRounds = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10;

//     const defaultAdminUser: Prisma.UserCreateInput = {
//         username: 'admin',
//         password: await bcrypt.hash(process.env.ADMIN_PASSWORD || "default_admin_password", saltRounds),
//         blogs: {
//             createMany: {
//                 data: [
//                     {
//                         title: "JavaScript Blog Tutorial",
//                         body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, odit blanditiis enim sit cupiditate, asperiores minima veritatis delectus nisi praesentium accusamus ab quasi. Commodi eveniet quo culpa corporis repellat accusamus, magni quos. Atque facilis, voluptas obcaecati ad harum asperiores reprehenderit, explicabo tempore, cupiditate magnam consequatur odit soluta voluptates quasi? Earum."
//                     },
//                     {
//                         title: "TypeScript Learning together",
//                         body: "This is a course in typescript that teaches users the importance of type safety when coding bigger projects like this one Lorem ipsum dolor sit amet consectetur adipisicing elit Sapiente odit blanditiis enim sit cupiditate asperiores minima veritatis delectus nisi praesentium accusamus ab quasi Commodi eveniet quo culpa corporis repellat accusamus magni quos Atque facilis voluptas obcaecati ad harum asperiores reprehenderit explicabo tempore cupiditate magnam consequatur odit soluta voluptates quasi Earum"
//                     },
//                     {
//                         title: "React, a js framework",
//                         body: "This is a react framework course that also uses tsx for type safety. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, odit blanditiis enim sit cupiditate, asperiores minima veritatis delectus nisi praesentium accusamus ab quasi. Commodi eveniet quo culpa corporis repellat accusamus, magni quos. Atque facilis, voluptas obcaecati ad harum asperiores reprehenderit, explicabo tempore, cupiditate magnam consequatur odit soluta voluptates quasi? Earum."
//                     },
//                     {
//                         title: "Express backend framework for Nodejs",
//                         body: "Want a backend framework that is literally only good for making apis, try express. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, odit blanditiis enim sit cupiditate, asperiores minima veritatis delectus nisi praesentium accusamus ab quasi. Commodi eveniet quo culpa corporis repellat accusamus, magni quos. Atque facilis, voluptas obcaecati ad harum asperiores reprehenderit, explicabo tempore, cupiditate magnam consequatur odit soluta voluptates quasi? Earum."
//                     },
//                     {
//                         title: "Making friends",
//                         body: "I won't be able to assist but I heard somewhere that touching grass is a good first step, best of luck to you on your journey. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, odit blanditiis enim sit cupiditate, asperiores minima veritatis delectus nisi praesentium accusamus ab quasi. Commodi eveniet quo culpa corporis repellat accusamus, magni quos. Atque facilis, voluptas obcaecati ad harum asperiores reprehenderit, explicabo tempore, cupiditate magnam consequatur odit soluta voluptates quasi? Earum."
//                     }
//                 ]
//             }
//         }
//     };




//     const defaultUsers: Prisma.UserCreateInput[] = [
//         defaultAdminUser
//     ];

//     return defaultUsers;
// }



// async function insertDefaultValues() {
//     const defaultUsers = await buildDefaultValues();

//     for (const userData of defaultUsers) {
//         await prisma.user.create({
//             data: userData
//         });
//     }
// }






async function uploadFilesToSupabase(): Promise<Files[]> {
    const fileNames = await fs.readdir(IMAGES_DIR);
    const random30ImgFiles =
        faker.helpers.shuffle(fileNames).slice(0, 30);


    const files =
        await Promise.all(
            random30ImgFiles.map(async (fileName): Promise<Prisma.FilesCreateInput & { buffer: Buffer }> => {
                const filePath = path.join(IMAGES_DIR, fileName);
                const fileBuffer = await fs.readFile(filePath);
                const mimeType = mime.lookup(filePath) || 'application/octet-stream';


                const fileExt = fileName.split(".").pop();
                const storagePath = `${crypto.randomUUID()}.${fileExt}`;


                try {

                    const { error } = await supabase.storage
                        .from(process.env.SUPABASE_BUCKET_NAME || "uploads")
                        .upload(storagePath, fileBuffer, {
                            contentType: mimeType,
                            upsert: false
                        });



                    if (error) {
                        throw new Error(error.message);
                    };


                    return {
                        filename: fileName,
                        filesize: fileBuffer.length,
                        mimetype: mimeType,
                        buffer: fileBuffer,
                        supabaseFileId: storagePath
                    };


                } catch (error) {
                    if (error instanceof Error) {
                        throw new Error(error.message);
                    }

                    throw new Error("Unknown error occurred while uploading file to Supabase storage");
                }

            })
        );


    const filesDb = await prisma.files.createManyAndReturn({
        data: files.map(({ buffer, ...file }) => file),
    });


    return filesDb;


}


async function generateRandomProfiles(
    files: Files[],
    numProfiles: number
): Promise<User[]> {
    const password = process.env.ADMIN_PASSWORD || "defaultadminpassword";
    const hashedPassword = await bcrypt.hash(password, process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10);




    const usersDb: User[] = await prisma.user.createManyAndReturn({
        data: Array.from(
            { length: numProfiles },
            (): Prisma.UserCreateManyInput => ({
                username: faker.internet.userName(),
                password: hashedPassword,
                aboutMe: faker.lorem.paragraph(2),
                profileImgId: randomItemFromArray(files)?.id || null,
                accountBackgroundImgId: randomItemFromArray(files)?.id || null,
            })
        )
    })

    return usersDb;

}







type CreateCommentContext = {
    userId: string;
    postId: string;
    files: Files[];
    parentCommentId?: string;
};


function createTextComment({
    userId,
    postId,
    parentCommentId,
}: CreateCommentContext): Prisma.CommentCreateManyInput {

    return {
        userId,
        postId,
        parentCommentId,
        textContent: faker.lorem.paragraphs(1),
    };
}


function createImageComment({
    userId,
    postId,
    files,
    parentCommentId,
}: CreateCommentContext): Prisma.CommentCreateManyInput {

    const fileId = randomItemFromArray(files)?.id;

    if (!fileId) {
        throw new Error("No files available to associate with the comment.");
    }

    return {
        userId,
        postId,
        parentCommentId,
        singleGifOrImgId: fileId
    };
}

const generateCommentMethods = [
    createTextComment,
    createImageComment
]


function createRandomComment(
    context: CreateCommentContext
): Prisma.CommentCreateManyInput {

    const generateMethod = faker.helpers.arrayElement(generateCommentMethods);

    return generateMethod(context);
}


async function prismaComment(data: Prisma.CommentCreateManyInput[]): Promise<Comment[]> {
    const commentsDb = await prisma.comment.createManyAndReturn({
        data
    });

    return commentsDb;
}







async function generateRandomComments(
    users: User[],
    files: Files[],
    posts: Post[],
    rangeOfCommentsPerPost: { min: number; max: number }
): Promise<Comment[]> {

    // const operations: Array<(userId: string, postId: string) => Prisma.CommentCreateManyInput> = [
    //     (userId: string, postId: string) => ({
    //         userId,
    //         postId,
    //         textContent: faker.lorem.paragraphs(1),
    //     }),
    //     (userId: string, postId: string) => {
    //         const fileId = randomItemFromArray(files)?.id;
    //         if (!fileId) {
    //             throw new Error("No files available to associate with the comment.");
    //         }

    //         return {
    //             userId,
    //             postId,
    //             singleGifOrImgId: fileId
    //         }
    //     }
    // ]


    const commentsData: Prisma.CommentCreateManyInput[] = posts.flatMap(post => {

        const min = rangeOfCommentsPerPost.min;
        const max = rangeOfCommentsPerPost.max;

        const randomNoComments = randomInt({ min, max });


        return Array.from({ length: randomNoComments }, (): Prisma.CommentCreateManyInput => {
            const user = randomItemFromArray(users);
            if (!user) {
                throw new Error("No users available to associate with the comment.");
            }

            // const operation =
            //     operations[Math.floor(Math.random() * operations.length)];

            return createRandomComment({
                userId: user.id,
                postId: post.id,
                files,
            });
        });
    });


    // const commentsDb = await prisma.comment.createManyAndReturn({
    //     data: commentsData
    // });


    return await prismaComment(commentsData);


}

async function generateRandomCommentReplies(
    users: User[],
    files: Files[],
    originalComments: Comment[],
    repliesPerIteration: number,
    iterations: number,
): Promise<Comment[]> {

    const commentsToReplyTo = [...originalComments];

    for (let iteration = 0; iteration < iterations; iteration++) {

        const generated: Prisma.CommentCreateManyInput[] = [];

        for (let i = 0; i < repliesPerIteration; i++) {

            const user = randomItemFromArray(users);
            if (!user) {
                throw new Error("No users available to associate with the comment reply.");
            }

            const parentComment = randomItemFromArray(commentsToReplyTo);
            if (!parentComment) {
                throw new Error("No comments available to reply to.");
            }


            generated.push(createRandomComment({
                userId: user.id,
                postId: parentComment.postId,
                files,
                parentCommentId: parentComment.id
            }));
        }

        const newReplies = await prismaComment(generated);

        commentsToReplyTo.push(...newReplies);

    }

    return commentsToReplyTo;
}










type GeneratedPost = {
    post: Prisma.PostCreateManyInput;
    file?: Prisma.PostFileContentCreateManyInput;
};

type CreatePostContext = {
    userId: string;
    files: Files[];
    parentPostId?: string;
};

function randomFile(files: Files[]) {
    const file = faker.helpers.arrayElement(files);

    if (!file) {
        throw new Error("No files available.");
    }

    return file;
}

function createTextPost({
    userId,
    parentPostId,
}: CreatePostContext): GeneratedPost {

    const id = crypto.randomUUID();

    return {
        post: {
            id,
            userId,
            parentPostId,
            textContent: faker.lorem.paragraphs(3),
        }
    };
}

function createImagePost({
    userId,
    parentPostId,
    files,
}: CreatePostContext): GeneratedPost {

    const id = crypto.randomUUID();

    const file = randomFile(files);

    return {
        post: {
            id,
            userId,
            parentPostId,
        },
        file: {
            fileId: file.id,
            postId: id,
        }
    };
}

function createTextAndImagePost({
    userId,
    parentPostId,
    files,
}: CreatePostContext): GeneratedPost {

    const id = crypto.randomUUID();

    const file = randomFile(files);

    return {
        post: {
            id,
            userId,
            parentPostId,
            textContent: faker.lorem.paragraphs(2),
        },
        file: {
            fileId: file.id,
            postId: id,
        }
    };
}

const generators = [
    createTextPost,
    createImagePost,
    createTextAndImagePost,
];

function createRandomPost(
    context: CreatePostContext
): GeneratedPost {

    const generator = faker.helpers.arrayElement(generators);

    return generator(context);
}

async function persistPosts(
    generated: GeneratedPost[]
): Promise<Post[]> {

    const posts = generated.map(x => x.post);

    const files = generated
        .flatMap(x => x.file ? [x.file] : []);

    const postsDb = await prisma.post.createManyAndReturn({
        data: posts,
    });

    if (files.length > 0) {
        await prisma.postFileContent.createMany({
            data: files,
        });
    }

    return postsDb;
}

async function generateRandomPosts(
    users: User[],
    files: Files[],
    postsPerUser: number,
): Promise<Post[]> {

    const generated: GeneratedPost[] = [];

    for (const user of users) {

        for (let i = 0; i < postsPerUser; i++) {

            generated.push(
                createRandomPost({
                    userId: user.id,
                    files,
                })
            );

        }

    }

    return persistPosts(generated);

}


async function generateRandomPostReplies(
    users: User[],
    files: Files[],
    originalPosts: Post[],
    repliesPerIteration: number,
    iterations: number,
): Promise<Post[]> {

    const postsToReplyTo = [...originalPosts];

    for (let iteration = 0; iteration < iterations; iteration++) {

        const generated: GeneratedPost[] = [];

        for (let i = 0; i < repliesPerIteration; i++) {

            const user = faker.helpers.arrayElement(users);

            const parent =
                faker.helpers.arrayElement(postsToReplyTo);

            generated.push(
                createRandomPost({
                    userId: user.id,
                    files,
                    parentPostId: parent.id,
                })
            );

        }

        const newReplies = await persistPosts(generated);

        postsToReplyTo.push(...newReplies);

    }

    return postsToReplyTo;

}











//SO WHAT I WANT TO DO WITH POSTS IS QUITE SIMPLE, JUST GIVE A NUMBER OF TIMES TO RUN IT THROUGH
//THEN WITH THE HELP OF PARENT COMMENTS THAT YOU CAN PUT IN MAKE IT RECURSIVE - PROBABLY NEED A NEW REPLEIS FUNCTION THAT TAKES FROM THE SAME OPERATIONS
//

//WITH THE COMMENTS I NOW WANT TO SAY GIVE ME ANOTHER FUNCTION OF PARENT COMMENTS INSTEAD OF POSTS AND A NUMBER OF TIMES TO RECURSIVELY RUN
//THEN ATTACH THE NEW COMMENTS THROUGH THE SAME TWO OPERATIONS IN A SHARED FUNCTION THAT GET ATTACHED TO THE POSTS
//

async function main() {
    try {
        console.log('Seeding database with default values...');
        const files = await uploadFilesToSupabase();
        const users = await generateRandomProfiles(files, 13);

        const posts = await generateRandomPosts(users, files, 5);
        const comments = await generateRandomComments(
            users, files, posts, { min: 1, max: 5 }
        );

        await generateRandomPostReplies(
            users, files, posts, 3, 3
        );
        await generateRandomCommentReplies(
            users, files, comments, 3, 3
        );

        console.log('Database seeding completed.');

    } catch (error) {
        console.error('Error seeding database:', error);

    } finally {
        await prisma.$disconnect();

    }
}

main();
