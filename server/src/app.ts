

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import http from "http";


import { apiRouter as apiRouter } from "./controllers/routes";

import { environment } from "../../shared/constants";


import cookieParser from "cookie-parser";
import { ICustomErrorResponse } from "../../shared/features/api/models/APIErrorResponse";
import { User } from "@prisma/client";
import { CheckAccessTokenPayload } from "./auth/CheckAccessTokenPayload";
import { Server, Socket } from "socket.io";
import { connectedUsers } from "./sockets/UserSocketMapping";
import { SOCKET_SET_VISIBLE_ROOMS_LISTENER_KEY } from "../../shared/features/socket/constants";
import { watchedRooms } from "./sockets/WatchedRooms";
import { SOCKET_COMMENT_POST_IS_VISIBLE_ROOM_PREFIX } from "../../shared/features/commentsThread/constants";








const SERVER = path.resolve(process.cwd(), "server");
const CLIENT_DIST = path.resolve(process.cwd(), "client", "dist");



dotenv.config({
  path: path.join(SERVER, ".env"),
});

const app = express();
const server = http.createServer(app);

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




app.use("/api", apiRouter);

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


export const io = new Server(server, {
  cors: {
    origin: environment === "PROD" ? true : allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  },
});


io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;

  console.log("Socket authentication attempt with token: ", token);

  const checkResult = await CheckAccessTokenPayload(token);

  if (!checkResult.ok) {
    console.error("Socket authentication failed: ", checkResult.message);
    return next(new Error(checkResult.message));
  }

  socket.data.user = checkResult.user;

  next();
});



io.on("connection", (socket: Socket) => {
  console.log("A user connected: " + socket.id);
  const user: User = socket.data.user;

  const socketSet = connectedUsers.get(user.id);
  if (socketSet) {
    socketSet.add(socket.id);
  } else {
    connectedUsers.set(user.id, new Set([socket.id]));
  }


  socket.on("disconnect", () => {
    console.log("A user disconnected: " + socket.id);

    const socketIds = connectedUsers.get(user.id);
    socketIds?.delete(socket.id);

    if (socketIds && socketIds.size === 0) {
      connectedUsers.delete(user.id);
      return;
    }

    return;

  });



  socket.on(SOCKET_SET_VISIBLE_ROOMS_LISTENER_KEY, (postIds: string[]) => {
    const previous = watchedRooms.get(socket.id) ?? new Set();
    const next = new Set(postIds);

    for (const oldPost of previous) {
      if (!next.has(oldPost)) {
        socket.leave(`${SOCKET_COMMENT_POST_IS_VISIBLE_ROOM_PREFIX}:${oldPost}`);
      }
    }

    for (const newPost of next) {
      if (!previous.has(newPost)) {
        socket.join(`${SOCKET_COMMENT_POST_IS_VISIBLE_ROOM_PREFIX}:${newPost}`);
      }
    }

    watchedRooms.set(socket.id, next);


  });




});


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

