import { Router, Request, Response, NextFunction } from "express";
import { ensureJWTAuthentication } from "../auth/ensureJWTAuthentication";
import upload from "../supabase/multer";
import { COMMENT_IMG_GIF_KEY } from "../../../shared/features/comments/constants";


export const router = Router();

router.get("/:userId", ensureJWTAuthentication, (req: Request<{ userId: string }>, res: Response, next: NextFunction) => {
    //SO WHILST YOU'LL GET THE ORIGINAL BULK FROM /USERS/:USERID, THIS ENDPOINT WILL BE USED TO GET ANY ADDITIONAL comments THAT THE USER HAS MADE, AND WILL BE USED FOR INFINITE SCROLLING BUT NOT HAVING TO LOAD IT ALL IN ONE GO!!!
});



router.get("/:commentId/replies", ensureJWTAuthentication, (req: Request<{ commentId: string }>, res: Response, next: NextFunction) => {

});


router.post("/", ensureJWTAuthentication, upload.single(COMMENT_IMG_GIF_KEY), async (req: Request, res: Response, next: NextFunction) => {

});


router.delete("/:commentId", ensureJWTAuthentication, async (req: Request<{ commentId: string }>, res: Response, next: NextFunction) => {

});



router.post("/:commentId/like", ensureJWTAuthentication, async (req: Request<{ commentId: string }>, res: Response, next: NextFunction) => {

});

router.post("/:commentId/unlike", ensureJWTAuthentication, async (req: Request<{ commentId: string }>, res: Response, next: NextFunction) => {

});