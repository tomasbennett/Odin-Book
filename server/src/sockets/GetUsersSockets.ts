import { Socket } from "socket.io";
import { ICustomErrorResponse } from "../../../shared/features/api/models/APIErrorResponse";
import { connectedUsers } from "./UserSocketMapping";
import { io } from "../app";

export function GetUsersSockets(userId: string, usersCurrentSocketId: string): {
    sockets: Socket[],
    ok: true
} | ICustomErrorResponse {

    const userSocketIds = connectedUsers.get(userId);
    if (!userSocketIds || !userSocketIds.has(usersCurrentSocketId)) {
        return {
            ok: false,
            status: 404,
            message: "User doesn't have a current socket Id that matches the socket Ids available for the user with this access token!!!"
        }
    }

    const sockets = [...userSocketIds]
        .map(id => io.sockets.sockets.get(id))
        .filter((socket): socket is Socket => socket !== undefined);

    if (!sockets || sockets.length === 0) {
        return {
            ok: false,
            status: 404,
            message: "User doesn't have a current socket Id that matches the socket Ids available for the user with this access token!!!"
        }
    }




    return {
        ok: true,
        sockets
    };
}