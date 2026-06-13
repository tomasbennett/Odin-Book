import { NextFunction, Request, Response, Router } from "express";
import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";

export const apiRouter = Router();




apiRouter.use((req: Request, res: Response<ICustomErrorResponse>, next: NextFunction) => {
    return res.status(404).json({
        ok: false,
        status: 404,
        message: "The requested endpoint does not exist!!!"
    });
});