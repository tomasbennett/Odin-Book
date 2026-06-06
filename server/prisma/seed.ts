// import { Prisma, PrismaClient } from '@prisma/client';

// // import "dotenv/config";
// import dotenv from "dotenv";
// dotenv.config({
//     path: "../.env"
// });
// import bcrypt from "bcrypt";

// //AT THE END TEST IF YOU CAN IMPORT FROM THE SHARED FOLDER THROUGH A SEPARATE TSCONFIG.JSON FILE IN PRISMA FOLDER AND THEN ADD TO THE SEED COMMAND IN PACKAGE.JSON FILE
// const prisma = new PrismaClient();

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



// async function main() {
//     try {
//         console.log('Seeding database with default values...');
//         await insertDefaultValues();
//         console.log('Database seeding completed.');
        
//     } catch (error) {
//         console.error('Error seeding database:', error);

//     } finally {
//         await prisma.$disconnect();

//     }
// }

// main();
