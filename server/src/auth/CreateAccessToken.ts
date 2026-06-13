import { User } from "@prisma/client";

import jwt from "jsonwebtoken";
import { IAuthUserInfo } from "../../../shared/features/auth/models/IAuthUserInfo";

export function CreateAccessToken(userId: string): string {
    const accessToken = jwt.sign({
        sub: userId,
    }, process.env.ACCESS_TOKEN_SECRET || "default_access_token_secret", {
        expiresIn: '5m'
    });

    return accessToken;
}