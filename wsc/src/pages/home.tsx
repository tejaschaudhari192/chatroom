import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import Modal from "@/components/modal"

interface HomeProps {
    username: string | null;
    setUsername: (username: string) => void;
}


export function Home({ username, setUsername }: HomeProps) {
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null)
    const handleChat = () => {
        if (inputRef.current && inputRef.current.value) {
            navigate("/chat/" + inputRef.current.value)
        }
    }
    const [modal, setModal] = useState<boolean>(false);

    useEffect(() => {
        if (!username) setModal(true)
        else setModal(false)
    }, [username])



    return (
        <div className="h-screen flex justify-center items-center w-screen  bg-amber-200">
            <div>
                <Tabs defaultValue="account">
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
                            <CardContent className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="tabs-demo-name">Your Name</Label>
                                    <Input id="tabs-demo-name" ref={inputRef} placeholder="Enter a room name/id" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleChat}>Create Room</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="join">
                        <Card>
                            <CardHeader>
                                <CardTitle>Join</CardTitle>
                                <CardDescription>
                                    Enter an existing Room ID to join the chat.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="tabs-demo-new">Enter Id</Label>
                                    <Input id="tabs-demo-new" type="id" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Join</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
            <Modal isOpen={modal} setUsername={setUsername} />
        </div>
    )
}