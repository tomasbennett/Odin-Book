import { Router, Request, Response, NextFunction } from "express";
import { ensureJWTAuthentication } from "../auth/ensureJWTAuthentication";


export const router = Router();



router.get("/", ensureJWTAuthentication, (req: Request, res: Response, next: NextFunction) => {

});