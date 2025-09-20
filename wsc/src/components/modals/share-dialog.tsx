import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getGeneratedLink, handleCopyLink } from "@/lib/utils";
import { useChatNavigation } from "@/hooks/useChatNavigation";

interface LinkShareDialogProps {
    generatedLink: string | null;
    isOpen: boolean;
}

export const LinkShareDialog: React.FC<LinkShareDialogProps> = ({ generatedLink, isOpen }) => {
    const { handleJoinChat } = useChatNavigation();

    return (
        <Dialog open={isOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Join & Share Link</DialogTitle>
                </DialogHeader>
                <div className="flex gap-2 my-2">
                    {generatedLink && (
                        <Input value={getGeneratedLink(generatedLink)} placeholder="Enter username" readOnly />
                    )}
                    <Button
                        onClick={() => {
                            handleCopyLink(getGeneratedLink(generatedLink!));
                        }}
                    >
                        Copy
                    </Button>
                    <Button onClick={() => {
                        handleJoinChat(generatedLink!)
                    }}>Join</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
