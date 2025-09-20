import { useNavigate } from "react-router-dom";

export const useChatNavigation = () => {
    const navigate = useNavigate();

    const handleChat = (generatedLink: string | null) => {
        if (generatedLink) {
            navigate("/chat/" + generatedLink);
        }
    };

    const handleJoinChat = (generatedLink:string) => {
            navigate("/chat/" + generatedLink);
    };

    return {
        // inputRef,
        handleChat,
        handleJoinChat,
    };
};
