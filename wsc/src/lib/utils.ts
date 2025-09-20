import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import cryptoRandomString from "crypto-random-string";
import { toast } from "sonner";

export function uniqueIdGenerator(): string {
    return cryptoRandomString({ length: 5 });
}
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link).then(() => {
        toast.success("Link copied to clipboard!");
    }).catch(err => {
        toast.error("Failed to copy link.");
        console.error("Copy failed", err);
    });
};

export const getGeneratedLink = (generatedLink: string) => {
    return window.location.href + "chat/" + generatedLink;
};