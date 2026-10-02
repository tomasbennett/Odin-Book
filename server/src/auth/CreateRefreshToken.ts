import { prisma } from "../../lib/prisma";
import { User } from "@prisma/client";
import { CookieOptions, Response } from "express";

import crypto from "crypto";
import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";
import { environment } from "../../../shared/constants";






export async function CreateRefreshToken(userId: string): Promise<{
    ok: true;
    refreshToken: string;
    cookieOptions: CookieOptions
} | {
    ok: false;
    error: string;
}> {

    try {
        const refreshToken = crypto.randomBytes(64).toString('hex');
        const refreshTokenHash = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex");
    
        await prisma.refreshToken.create({
            data: {
                hashedToken: refreshTokenHash,
                userId: userId,
            }
        });
    
        return {
            ok: true,
            refreshToken: refreshToken,
            cookieOptions: {
                httpOnly: true,
                secure: environment === "PROD",
                sameSite: environment === "PROD" ? "none" : "lax",
                // maxAge: expiry
            }
        };
        
    } catch (error) {
        if (error instanceof Error) {
            return {
                ok: false,
                error: error.message
            }
        }

        return {
            ok: false,
            error: "An unknown error occurred while creating the refresh token."
        }
    }

}