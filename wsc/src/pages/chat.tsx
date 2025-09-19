import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SendHorizonal } from "lucide-react";
import { Bubble } from "@/components/ui/bubble";
import type { sendType } from "@/types";
import configurations from "@/config/configurations";
import { useParams } from "react-router-dom";

interface Message {
    username: string;
    message: string;
}
function ChatRoom() {
    const [message, setMessage] = useState<string | null>();
    const wsRef = useRef<WebSocket>(null);
    const [messages, setMessages] = useState<Message[]>(() => {
        const storedHistory = localStorage.getItem("history");
        return storedHistory ? JSON.parse(storedHistory) : [];
    });
    const { id } = useParams()
    const username = localStorage.getItem("username");

    function sendMessage() {
        if (wsRef && message) {
            const chatMessage = {
                type: "chat",
                payload: {
                    message: message,
                    username
                }
            }
            wsRef.current?.send(JSON.stringify(chatMessage));
            setMessage(null);
        }
    }

    useEffect(() => {
        const ws = new WebSocket(configurations.base_url);
        wsRef.current = ws
        ws.onmessage = (ev) => {
            console.log(ev)
            const parsedData = JSON.parse(ev.data);

            if (parsedData.type == "message") {
                const message = {
                    username: parsedData.payload.username,
                    message: parsedData.payload.message
                }
                setMessages((msg) => [...msg, message]);
            }
            if (parsedData.type == "status") {
                alert("Status: " + parsedData.payload.status)
            }
        }

        wsRef.current.onopen = () => {
            const joinMessage: sendType = {
                type: "join",
                payload: {
                    roomId: id!.toString()
                }
            }
            ws.send(JSON.stringify(joinMessage))
        }
        wsRef.current.onerror = () => {
            alert("offline")
        }
        return () => {
            ws.close();
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("history", JSON.stringify(messages))
    }, [messages])

    return (
        <div className='h-screen justify-between p-6 dark:bg-slate-800'>
            <div className='h-[90vh] flex flex-col gap-4'>
                {messages.map((msg, index) => {
                    const isClientMessage = username === msg.username
                    return (
                        <div
                            key={index}
                            className={`flex ${isClientMessage ? "justify-start" : "justify-end"}`}
                        >
                            <Bubble intent={isClientMessage ? "outgoing" : "incoming"}>
                                {msg.message}
                            </Bubble>
                        </div>
                    )
                })}
            </div>
            <div className="flex gap-2">
                <Input 
                onChange={(e) => {
                    setMessage(e.target.value)
                }} 
                value={message||""}
                placeholder="Type message" 
                />
                <Button
                    onClick={sendMessage}
                    disabled={!message}
                >
                    <SendHorizonal />
                </Button>
            </div>
        </div >
    )
}

export default ChatRoom
