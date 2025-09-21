import type WebSocket from "ws";

export interface User {
    socket:WebSocket;
    room:string;
}
