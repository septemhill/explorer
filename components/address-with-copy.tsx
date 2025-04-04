"use client";

import { Copy } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

interface AddressWithCopyProps {
    address: string;
    className?: string;
}

export function AddressWithCopy({ address }: AddressWithCopyProps) {
    const { toast } = useToast();

    const handleCopyClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        try {
            await navigator.clipboard.writeText(address);
            toast({
                title: "Copied!",
                description: "Address copied to clipboard.",
            });
        } catch (error) {
            console.error("Failed to copy address:", error);
        }
    };

    const truncatedAddress = address.substring(0, 6) + "..." + address.substring(address.length - 6);

    return (
        <div className="flex items-center">
            <Link href={`/account/${address}`} className="text-blue-500 dark:text-blue-400 hover:underline">
                <span>{truncatedAddress}</span>
            </Link>
            <button className="p-0 m-0 border-none bg-none cursor-pointer" onClick={handleCopyClick}>
                <Copy className="h-4 w-4" />
            </button>
        </div>
    );
}
