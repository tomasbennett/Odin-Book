import { Router, Request, Response, NextFunction } from "express";
import { ensureJWTAuthentication } from "../auth/ensureJWTAuthentication";


export const router = Router();



router.get("/:searchedUserId", ensureJWTAuthentication, (req: Request<{ searchedUserId: string }>, res: Response, next: NextFunction) => {
    




});


router.get("/search/:searchQuery", ensureJWTAuthentication, (req: Request<{ searchQuery: string }>, res: Response, next: NextFunction) => {
    const query = req.query;


});