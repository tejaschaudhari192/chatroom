import type { JoinMessage } from "@/types/message.js";
import type { User } from "@/types/index.js";
import type WebSocket from "ws";

export const handleJoin = (
    message: JoinMessage,
    socket: WebSocket,
    users: User[]
) => {
    const roomId = message.payload.roomId;
    users.push({ socket, room: roomId });
};
