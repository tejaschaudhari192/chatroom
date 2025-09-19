import type WebSocket from "ws";
import { WebSocketServer } from "ws";
import type { User } from "./types/index.js";

const wss = new WebSocketServer({ port: 8080 });

let userCount = 0;
let allSockets:User[] = [];

wss.on("connection", function (socket) {
    
    socket.on("message",(msg) => {
        const parsedMsg = JSON.parse(msg.toString());
        if (parsedMsg.type === "join") {
            allSockets.push({
                socket,
                room:parsedMsg.payload.roomId
            })
        }
        if (parsedMsg.type === "chat") {
            let currentUserRoom:unknown = null;
            allSockets.forEach(user => {
                if (user.socket == socket) {
                    currentUserRoom=user.room
                }
            });

            allSockets.forEach(user => {
                if (user.room == currentUserRoom) {
                    user.socket.send(parsedMsg.payload.message)
                }
            });
        }
        console.log(allSockets);
    })
});

