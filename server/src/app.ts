

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";


import { router as apiRouter } from "./controllers/api";
import { router as authRouter } from "./controllers/auth";
import { router as signInRouter } from "./controllers/sign-in";
import { router as uploadRouter } from "./controllers/upload";
import { router as downloadRouter } from "./controllers/downloads";

import { environment } from "../../shared/constants";


import cookieParser from "cookie-parser";
import { ICustomErrorResponse } from "../../shared/features/api/models/APIErrorResponse";








const SERVER = path.resolve(process.cwd(), "server");
const CLIENT_DIST = path.resolve(process.cwd(), "client", "dist");



dotenv.config({
  path: path.join(SERVER, ".env"),
});

const app = express();

const allowedOrigins: string[] = [
  "http://localhost:5173",
  "http://localhost:3000",
];
app.use(cors({
  origin: environment === "PROD" ? true : allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(CLIENT_DIST));

app.use(cookieParser());




app.use("/api", apiRouter, authRouter, signInRouter, uploadRouter, downloadRouter);


app.get(/.*/, (req: Request, res: Response, next: NextFunction) => {

  return res.sendFile(path.join(CLIENT_DIST, "index.html"));


});



app.use((err: Error, req: Request, res: Response<ICustomErrorResponse>, next: NextFunction) => {
  if (err instanceof Error) {
    const error: ICustomErrorResponse = {
      ok: false,
      status: 501,
      message: err.message + " : " + err.name
    }

    return res.status(error.status).json(error);

  }

  const error: ICustomErrorResponse = {
    ok: false,
    status: 501,
    message: "An unknown error occurred on the backend!!!"
  }
  
  return res.status(error.status).json(error);
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

});
