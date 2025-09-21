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
  const inputRef = useRef<HTMLInputElement | null>(null); // Ref for input focus
  const chatContainerRef = useRef<HTMLDivElement | null>(null); // Ref for chat container
  const navigate = useNavigate();
  const { id } = useParams();

  const username = localStorage.getItem("username");
  localStorage.setItem("redirect", window.location.pathname);

  // Load message history from localStorage
  useEffect(() => {
    const historyStored = localStorage.getItem("history");
    if (historyStored) {
      const parsedHistory: History = JSON.parse(historyStored);
      setMessages(parsedHistory.messages);
    }
  }, []);

  // Handle sending messages
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
      setMessage(""); // Reset message input
    }
  }

  // WebSocket connection and message handling
  useEffect(() => {
    const ws = new WebSocket(configurations.base_url);
    wsRef.current = ws;

    // WebSocket onmessage handler
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

    // Send join message when connection is opened
    ws.onopen = () => {
      const joinMessage: sendType = {
        type: "join",
        payload: {
          roomId: id!,
        },
      };
      ws.send(JSON.stringify(joinMessage));
    };

    // Cleanup on component unmount
    return () => {
      ws.close();
    };
  }, [id]);

  // Store messages in localStorage
  useEffect(() => {
    if (messages.length) {
      localStorage.setItem(
        "history",
        JSON.stringify({
          roomId: id,
          messages,
        })
      );
    }
  }, [messages, id]);

  // Redirect to home if no username is set
  useEffect(() => {
    if (!username) {
      navigate("/");
    } else {
      localStorage.removeItem("redirect");
    }
  }, [username, navigate]);

  // Auto-scroll the chat to the bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-screen flex flex-col p-6 dark:bg-slate-800">
      {/* Header with Username */}
      <header className="mb-4 flex justify-between items-center bg-slate-400 p-4 dark:text-white rounded-t-lg shadow-md">
        <div className="text-lg font-semibold">{username}</div> {/* Display the username */}
      </header>

      {/* Chat Messages Area */}
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

      {/* Message Input Section */}
      <div className="flex gap-2">
        <Input
          ref={inputRef} // Focus management using ref
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
