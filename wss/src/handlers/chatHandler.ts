import type { ChatMessage, ServerChatMessage } from "@/types/message.js";
import type { User } from "@/types/index.js";

export const handleChat = (
    message: ChatMessage,
    users: User[]
) => {
    const roomId = message.payload.roomId;

    const response: ServerChatMessage = {
        type: "message",
        payload: {
            message: message.payload.message,
            username: message.payload.username
        }
    };

    users.forEach(user => {
        if (user.room === roomId) {
            user.socket.send(JSON.stringify(response));
        }
    });
};
