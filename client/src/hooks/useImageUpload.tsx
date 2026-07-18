import { useEffect, useState } from "react";
import { allowedImgTypes, maxFileSizeInBytes } from "../../../shared/features/files/constants";
import { useError } from "../features/error/contexts/ErrorContext";
import { FileSingleSchema } from "../../../shared/features/files/models/INewMandatoryFile";
import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";
import { IImageUploadRes } from "../models/IImageUploadRes";
import { knownError, unknownError } from "../constants/errorConstants";




export function useImageUpload() {

    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [preview, setPreview] = useState<string | null>(null);
    const errorCtx = useError();

    function handleInputChange(
        e: React.ChangeEvent<HTMLInputElement>
    ): IImageUploadRes {
        if (isLoading) {
            return {
                ok: false,
                status: 0,
                message: "Still loading default images!!!"
            }
        }

        const selectedFile = e.target?.files;
        if (!selectedFile) return {
            ok: false,
            status: 0,
            message: "No file uploaded through the input!!!"
        };

        return handleSingleFileChange(selectedFile[0]);
    }

    const handleSingleFileChange = (
        file: File | null
    ): IImageUploadRes => {

        if (isLoading) {
            return {
                ok: false,
                status: 0,
                message: "Still loading default images!!!"
            }
        }

        if (!file) {
            setPreview(null);
            setFile(null);
            return {
                ok: false,
                status: 0,
                message: "No file uploaded through the input!!!"
            };
        }

        const imgResult = FileSingleSchema(allowedImgTypes, maxFileSizeInBytes).safeParse(file);
        if (!imgResult.success) {
            const errorMessage = imgResult.error.issues.map(issue => issue.message).join("\n");
            const err: ICustomErrorResponse = {
                ok: false,
                status: 400,
                message: errorMessage,
            }
            errorCtx?.throwError(err);
            return err;
        }

        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);

        setFile(file);
        return { ok: true, file };
    }


    const handleUrl = async (imgUrl: string): Promise<IImageUploadRes> => {
        try {
            setIsLoading(true);
            // setPreview(imgUrl);

            const response = await fetch(imgUrl);

            if (!response.ok) {
                throw new Error("Default image failed to respond from fetch!!!");
            }

            const blob = await response.blob();

            const file = new File([blob], imgUrl, {
                type: blob.type,
                lastModified: Date.now(),
            });

            setFile(file);

            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);

            return {
                ok: true,
                file
            };


        } catch (error) {
            setPreview(null);
            setFile(null);

            if (error instanceof Error) {
                errorCtx?.throwError(knownError(error));
                return knownError(error);
            }

            errorCtx?.throwError(unknownError);
            return unknownError;

        } finally {
            setIsLoading(false);
        }

    }

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);


    return {
        file,
        preview,
        handleInputChange,
        handleSingleFileChange,
        handleUrl,
        isLoading
    }

}