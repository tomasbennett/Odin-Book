import { Prisma, PrismaClient } from '@prisma/client';

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
// import mime from 'mime';

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






const users: Prisma.UserCreateInput[] = [];

const posts: Prisma.PostCreateInput[] = [];
const directPostReplies: Prisma.PostCreateInput[] = [];
const secondLayerPostReplies: Prisma.PostCreateInput[] = [];

const comments: Prisma.CommentCreateInput[] = [];
const directCommentReplies: Prisma.CommentCreateInput[] = [];
const secondLayerCommentReplies: Prisma.CommentCreateInput[] = [];






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



async function uploadFilesToSupabase(): Promise<Prisma.FilesCreateInput[]> {
    const fileNames = await fs.readdir(IMAGES_DIR);
    const random30ImgFiles =
        faker.helpers.shuffle(fileNames).slice(0, 30);


    const files =
        await Promise.all(random30ImgFiles.map(async (fileName): Promise<Prisma.FilesCreateInput & { buffer: Buffer }> => {
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

        }));


    return files;


}


async function generateRandomProfiles(numProfiles: number): Promise<Prisma.UserCreateInput[]> {
    const password = process.env.ADMIN_PASSWORD || "default_admin_password";
    const hashedPassword = await bcrypt.hash(password, process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10);

    
}








async function main() {
    try {
        console.log('Seeding database with default values...');
        await insertDefaultValues();
        console.log('Database seeding completed.');

    } catch (error) {
        console.error('Error seeding database:', error);

    } finally {
        await prisma.$disconnect();

    }
}

main();


//SO WHAT I WANT HERE IS 