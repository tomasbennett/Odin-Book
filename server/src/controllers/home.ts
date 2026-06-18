import { Router, Request, Response, NextFunction } from "express";
import { ensureJWTAuthentication } from "../auth/ensureJWTAuthentication";
import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";


export const router = Router();



router.get("/", 
    ensureJWTAuthentication, 
    async (req: Request, res: Response<ICustomErrorResponse>, next: NextFunction) => {
        
        const user = req.user!;

        try {
            
            //MAKE IT SO THAT YOU CAN FILTER BY HIGHEST LIKES, NEWEST CREATEDAT OR OLDEST CREATEDAT









        } catch (error) {
            next(error);

        }




});