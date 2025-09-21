import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizonal } from "lucide-react";
import { Bubble } from "@/components/ui/bubble";
import type { sendType } from "@/types";
import configurations from "@/config/configurations";
import { useNavigate, useParams } from "react-router-dom";

interface Message {
    username: string;
    message: string;
}

interface History {
    roomId: string;
    messages: Message[];
}

function ChatRoom() {
    const [message, setMessage] = useState<string | null>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const wsRef = useRef<WebSocket | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();
    const { id } = useParams();

    const username = localStorage.getItem("username");
    localStorage.setItem("redirect", window.location.pathname);

    useEffect(() => {
        const chatHistoryStored = localStorage.getItem("chatHistory");
        if (chatHistoryStored) {
            const parsedChatHistory: History[] = JSON.parse(chatHistoryStored);
            parsedChatHistory.forEach(history => {
                if (history.roomId == id) {
                    setMessages(history.messages)
                }
            });
        }
    }, []);

    function sendMessage() {
        if (wsRef.current && message && username) {
            const chatMessage = {
                type: "chat",
                payload: {
                    message,
                    username,
                    roomId: id,
                },
            };
            wsRef.current.send(JSON.stringify(chatMessage));
            setMessage("");
        }
    }

    useEffect(() => {
        const ws = new WebSocket(configurations.base_url);
        wsRef.current = ws;

        ws.onmessage = (ev) => {
            const parsedData = JSON.parse(ev.data);

            if (parsedData.type === "message") {
                const newMessage: Message = {
                    username: parsedData.payload.username,
                    message: parsedData.payload.message,
                };
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            }
        };

        ws.onopen = () => {
            const joinMessage: sendType = {
                type: "join",
                payload: {
                    roomId: id!,
                },
            };
            ws.send(JSON.stringify(joinMessage));
        };

        return () => {
            ws.close();
        };
    }, [id]);

    useEffect(() => {
        if (messages.length) {
            const previousHistory = localStorage.getItem("chatHistory");
            if (previousHistory) {
                const updatedHistory: History[] = [
                    ...JSON.parse(previousHistory),
                    {
                        roomId: id,
                        messages
                    }
                ]
                localStorage.setItem("chatHistory", JSON.stringify(updatedHistory))
            } else {
                localStorage.setItem("chatHistory", JSON.stringify([{
                    roomId: id,
                    messages
                }]))
            }

        }
    }, [messages, id]);

    useEffect(() => {
        if (!username) {
            navigate("/");
        } else {
            localStorage.removeItem("redirect");
        }
    }, [username, navigate]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="h-screen flex flex-col p-6 dark:bg-slate-800">
            <header className="mb-4 flex justify-between items-center bg-slate-400 p-4 dark:text-white rounded-t-lg shadow-md">
                <div className="text-lg font-semibold">{username}</div> {/* Display the username */}
            </header>

            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-100 dark:bg-slate-700 rounded-lg shadow-md"
            >
                <div className="flex flex-col gap-4 max-h-[80vh]">
                    {messages.map((msg, index) => {
                        const isClientMessage = username === msg.username;
                        return (
                            <div
                                key={index}
                                className={`flex ${isClientMessage ? "justify-start" : "justify-end"} mb-4`}
                            >
                                <Bubble
                                    message={msg.message}
                                    username={msg.username}
                                    intent={isClientMessage ? "outgoing" : "incoming"}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex gap-2">
                <Input
                    ref={inputRef} 
                    value={message || ""}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type message"
                    className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-slate-600 dark:bg-slate-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
                <Button
                    onClick={sendMessage}
                    disabled={!message}
                    className="self-end bg-blue-500 hover:bg-blue-600 text-white rounded-md p-2"
                >
                    <SendHorizonal />
                </Button>
            </div>
        </div>
    );
}

export default ChatRoom;
