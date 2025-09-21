import type WebSocket from "ws";
import type { SocketMessage } from "@/types/message.js";
import type { User } from "@/types/index.js";

import { handleJoin } from "@/handlers/joinHandler.js";
import { handleChat } from "@/handlers/chatHandler.js";

const allUsers: User[] = [];

export const onConnection = (socket: WebSocket) => {
    const statusMsg = {
        type: "status",
        payload: {
            status: "online"
        }
    };
    socket.send(JSON.stringify(statusMsg));

    socket.on("message", (msg) => {
        let parsed: SocketMessage;

        try {
            parsed = JSON.parse(msg.toString());
        } catch (err) {
            console.error("Failed to parse message:", err);
            return;
        }

        switch (parsed.type) {
            case "join":
                handleJoin(parsed, socket, allUsers);
                break;

            case "chat":
                handleChat(parsed, allUsers);
                break;

            default:
                console.warn("Unhandled message type:", parsed);
        }
    });

    // Optional: handle disconnection
    socket.on("close", () => {
        const index = allUsers.findIndex(u => u.socket === socket);
        if (index !== -1) {
            allUsers.splice(index, 1);
        }
    });
};
