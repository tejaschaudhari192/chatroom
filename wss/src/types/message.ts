export type MessageType = "join" | "chat" | "status" | "message";

export interface BaseMessage<T extends MessageType, P = unknown> {
    type: T;
    payload: P;
}

export type JoinMessage = BaseMessage<"join", { roomId: string }>;

export type ChatMessage = BaseMessage<"chat", { roomId: string; message: string; username: string }>;

export type StatusMessage = BaseMessage<"status", { status: string }>;

export type ServerChatMessage = BaseMessage<"message", { message: string; username: string }>;

export type SocketMessage = JoinMessage | ChatMessage;
export type ServerMessage = StatusMessage | ServerChatMessage;
