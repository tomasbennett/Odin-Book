import { NextFunction, Request, Response, Router } from "express";
import { ensureAuthentication } from "../auth/ensureAuthentication";
import upload from "../supabase/multer";
import { supabase } from "../supabase/client";
import { prisma } from "../db/prisma";
import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";
import { ICustomSuccessMessage } from "../../../shared/features/api/models/APISuccessResponse";




export const router = Router();

//NEW BLOG ROUTER

router.post("/files/upload", upload.single("file"), async (req: Request<{}, {}, { something: string }>, res: Response<ICustomErrorResponse | ICustomSuccessMessage>, next: NextFunction) => {
    try {
        const file = req.file;
        const user = req.user!;
        const body = req.body;

        if (!file) {
            return res.status(400).json({
                ok: false,
                status: 400,
                message: "No file uploaded"
            });
        }


        // const newBlogResult = NewBlogReqSchemaServer.safeParse(body);
        // if (!(newBlogResult.success)) {
        //     return res.status(400).json({
        //         ok: false,
        //         status: 400,
        //         message: "Issue with the request body or title!!!"
        //     });
        // }


        const { originalname, mimetype, size, buffer } = file;
        // const { title, body: blogBody } = newBlogResult.data;

        
        
        const fileExt = originalname.split(".").pop();
        const storagePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error } = await supabase.storage
            .from(process.env.SUPABASE_BUCKET_NAME || "uploads")
            .upload(storagePath, buffer, {
                    contentType: mimetype,
                    upsert: false
            });
            
        if (error) throw error;
            
            
            
        const newFilePrisma = await prisma.files.create({
            data: {
                filename: originalname,
                filesize: size,
                filetype: mimetype,
                supabaseFileId: storagePath,
            }
        });


        // const newBlog = await prisma.blog.create({
        //     data: {
        //         title: title,
        //         body: blogBody,
        //         blogImgFileId: newFilePrisma.id,
        //         userId: user.id
        //     }
        // });



        return res.status(201).json({
            ok: true,
            status: 201,
            message: "Blog uploaded successfully"
        });




    } catch (error) {
        next(error);

    }

});