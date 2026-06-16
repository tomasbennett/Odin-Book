import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";
import { prisma } from "../db/prisma";
import { supabase } from "../supabase/client";

export async function uploadFileToSupabase(
    file: Express.Multer.File,
): Promise<{
    ok: true,
    supabaseFileId: string
} | ICustomErrorResponse> {
    try {
        const { originalname, mimetype, size, buffer } = file;

        const fileExt = originalname.split(".").pop();
        const storagePath = `${crypto.randomUUID()}.${fileExt}`;

        const { error } = await supabase.storage
            .from(process.env.SUPABASE_BUCKET_NAME || "uploads")
            .upload(storagePath, buffer, {
                contentType: mimetype,
                upsert: false
            });

        if (error) {
            return {
                ok: false,
                status: 500,
                message: error.message
            };
        };

        

        return {
            ok: true,
            supabaseFileId: storagePath
        };

    } catch (error) {
        if (error instanceof Error) {
            return {
                ok: false,
                status: 500,
                message: error.message
            };
        }

        return {
            ok: false,
            status: 500,
            message: "Unknown error occurred while uploading file to Supabase storage"
        };
    }
}