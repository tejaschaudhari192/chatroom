import { WebSocketServer } from "ws";
import { onConnection } from "@/socketManager.js";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", onConnection);

console.log("WebSocket server running on ws://localhost:8080");
