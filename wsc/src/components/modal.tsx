import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRef } from "react";

// 1. Define an interface for the component's props for type safety.
interface ModalProps {
    isOpen: boolean;
    setUsername: (username: string) => void;
}

const Modal = ({ isOpen, setUsername }: ModalProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSetUsername = () => {
        const username = inputRef.current?.value;
        if (username) {
            setUsername(username);
        }
    };

    return (
        <Dialog open={isOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Set Your Username</DialogTitle>
                    <DialogDescription>
                        This name will be visible to others in the chat room.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex gap-2 my-2">
                    <Input ref={inputRef} placeholder="Enter username"></Input>
                    <Button onClick={handleSetUsername}>
                        Set
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default Modal;