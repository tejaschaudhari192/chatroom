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
  const redirectUrl = localStorage.getItem("redirect");

  const [connectionAttempted, setConnectionAttempted] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { handleJoinChat } = useChatNavigation();

  useEffect(() => {
    setShowUsernameModal(!username);
  }, [username]);

  useEffect(() => {
    const ws = new WebSocket(configurations.base_url);
    wsRef.current = ws;

    ws.onopen = () => setConnectionAttempted(true);

    ws.onmessage = (ev: MessageEvent) => {
      const data = JSON.parse(ev.data);
      if (data.type === "status") {
        toast.success("Server Connected");
      }
    };

    ws.onerror = ws.onclose = () => {
      if (!connectionAttempted) {
        toast.error("Server Failure");
      }
    };

    return () => ws.close();
  }, [connectionAttempted]);

  useEffect(() => {
    if (username && redirectUrl) {
      navigate(redirectUrl);
    }
  }, [username, redirectUrl]);

  const handleGenerateLink = () => {
    const link = uniqueIdGenerator();
    setGeneratedLink(link);
    navigator.clipboard.writeText(link).then(() => {
      toast.success("Room link copied to clipboard");
    });
  };

  const handleJoin = () => {
    const value = inputRef.current?.value.trim();
    if (!value) {
      toast.warning("Please enter a Room ID or link");
      return;
    }
    handleJoinChat(value);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-background text-foreground transition-colors">
      <Tabs defaultValue="create" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="join">Join</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create a Room</CardTitle>
              <CardDescription>
                Instantly generate a unique chat room link.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full" onClick={handleGenerateLink}>
                Generate Link
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="join">
          <Card>
            <CardHeader>
              <CardTitle>Join a Room</CardTitle>
              <CardDescription>
                Enter the Room ID or shared link to join.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Label htmlFor="join-input">Room ID or Link</Label>
              <Input
                id="join-input"
                ref={inputRef}
                placeholder="e.g., abcd1234"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleJoin();
                }}
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleJoin}>
                Join Room
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <UsernameModal isOpen={showUsernameModal} setUsername={setUsername} />
      <LinkShareDialog
        generatedLink={generatedLink}
        isOpen={!!generatedLink}
      />
    </div>
  );
}
