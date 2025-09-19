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

const Modal = ({ isOpen, setUsername }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <Dialog open={isOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Set Your Username</DialogTitle>
                    <DialogDescription>
                        <div className="flex gap-2 my-5">
                            <Input ref={inputRef} placeholder="Enter username"></Input>
                            <Button onClick={() => {
                                setUsername(inputRef.current?.value)
                            }}>
                                Set
                            </Button>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default Modal