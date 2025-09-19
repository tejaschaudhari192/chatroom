import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SendHorizonal } from "lucide-react";
import { Bubble } from "./components/ui/bubble";
import type { sendType } from "./types";
import configurations from "./config/configurations";

function App() {
    const inputRef = useRef<HTMLInputElement>(null);
    const wsRef = useRef<WebSocket>(null);

    const [messages, setMessages] = useState(["Hi"])




    function sendMessage() {
        const msg = inputRef.current?.value;
        if (wsRef && msg) {
            const chatMessage = {
                type: "chat",
                payload: {
                    message: msg
                }
            }
            wsRef.current?.send(JSON.stringify(chatMessage));
        }
    }

    useEffect(() => {
        const ws = new WebSocket(configurations.base_url);
        wsRef.current = ws
        ws.onmessage = (ev) => {
            setMessages((msg) => [...msg, ev.data]);
        }

        ws.onopen = () => {
            const joinMessage: sendType = {
                type: "join",
                payload: {
                    roomId: "123"
                }
            }
            ws.send(JSON.stringify(joinMessage))
        }
        return ()=>{
            ws.close()
        }
    }, [])


    return (
        <div className='h-screen flex flex-col justify-between p-6'>
            <div className='h-[90vh] '>
                {messages.map((msg, index) => {
                    return (
                        <Bubble key={index}>
                            {msg}
                        </Bubble>

                    )
                })}
            </div>
            <div className="flex gap-2">
                <Input ref={inputRef} placeholder="Type message" />
                <Button
                    onClick={sendMessage}
                // disabled={!inputRef.current?.value}
                >
                    <SendHorizonal />
                </Button>
            </div>
        </div>
    )
}

export default App
