import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import UsernameModal from "@/components/modals/username-modal";
import configurations from "@/config/configurations";
import { toast } from "sonner";
import { uniqueIdGenerator } from "@/lib/utils";
import { LinkShareDialog } from "@/components/modals/share-dialog";
import { useChatNavigation } from "@/hooks/useChatNavigation";

interface HomeProps {
    username: string | null;
    setUsername: (username: string) => void;
}

export function Home({ username, setUsername }: HomeProps) {
    const navigate = useNavigate();
    const wsRef = useRef<WebSocket | null>(null);
    // const inputRef = useRef<HTMLInputElement | null>(null);
    const redirectUrl = localStorage.getItem("redirect");
    const [connectionAttempted, setConnectionAttempted] = useState<boolean>(false);
    const [generatedLink, setGeneratedLink] = useState<string | null>(null);
    const [modal, setModal] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleGenerateLink = () => {
        setGeneratedLink(uniqueIdGenerator());
    };

    const { handleChat, handleJoinChat } = useChatNavigation();

    

    useEffect(() => {
        if (!username) setModal(true);
        else setModal(false);
    }, [username]);

    useEffect(() => {
        const ws = new WebSocket(configurations.base_url);
        wsRef.current = ws;

        const handleOpen = () => {
            // toast.success("Server Connected");
            setConnectionAttempted(true);
        };

        const handleMessage = (ev: MessageEvent) => {
            const parsedData = JSON.parse(ev.data);
            if (parsedData.type === "status") {
                toast.success("Server Connected")
            }
        };

        const handleError = () => {
            if (!connectionAttempted) {
                // Only show failure message if connection attempt has not been successful
                toast.error("Server Failure");
            }
        };

        const handleClose = () => {
            if (!connectionAttempted) {
                toast.error("Server Failure");
            }
        };

        if (wsRef.current) {
            wsRef.current.onopen = handleOpen;
            wsRef.current.onmessage = handleMessage;
            wsRef.current.onerror = handleError;
            wsRef.current.onclose = handleClose;
        }

        return () => {
            // Cleanup WebSocket connection
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [connectionAttempted]);

    useEffect(() => {
        if (username && redirectUrl) {
            navigate(redirectUrl);
        }
    }, [username, redirectUrl]);

    return (
        <div className="h-screen flex justify-center items-center w-screen bg-amber-200">
            <div>
                <Tabs defaultValue="create">
                    <TabsList>
                        <TabsTrigger value="create">Create</TabsTrigger>
                        <TabsTrigger value="join">Join</TabsTrigger>
                    </TabsList>
                    <TabsContent value="create">
                        <Card>
                            <CardHeader>
                                <CardTitle>Create</CardTitle>
                                <CardDescription>
                                    Create a new chat room and get an ID.
                                </CardDescription>
                            </CardHeader>
                            <CardFooter>
                                <Button onClick={handleGenerateLink}>Create Room</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="join">
                        <Card>
                            <CardHeader>
                                <CardTitle>Join</CardTitle>
                                <CardDescription>
                                    Enter an existing Room ID or link to join the chat.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="tabs-demo-new">Enter Id || Link</Label>
                                    <Input ref={inputRef} id="tabs-demo-new" type="text" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={() => {
                                    handleJoinChat(inputRef.current?.value!)
                                }}>Join</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
            <UsernameModal isOpen={modal} setUsername={setUsername} />
            <LinkShareDialog generatedLink={generatedLink} isOpen = {generatedLink?true:false}/>
        </div>
    );
}
