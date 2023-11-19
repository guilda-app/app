import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Form, FormControl, FormField, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import React from "react";
import { Input } from "@/components/ui/input";
import { createNewServer } from "@/lib/servers";
import { useModal } from "../../../hooks/use-modal-store";
import { X } from "lucide-react";
import { Icons } from "../icons";
import LordIcon from "../ui/lord-icon";
import { Button } from "../ui/button";

export default function DeleteMessageDialog() {
    const { isOpen, onClose, modal, modalArgs } = useModal();
    const [isLoading, setIsLoading] = React.useState(false);
    const { message } = modalArgs;
    const isModalOpen = isOpen && modal == "deleteMessage";
    
    const onSubmit = async () => {
        setIsLoading(true);
        throw new Error("Not implemented");
        setIsLoading(false);
    }

    const handleClose = (open: boolean = false) => {
        if (!open) {
            onClose();
        }
    }

    return (
        <AlertDialog open={isModalOpen} onOpenChange={handleClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete message</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this message?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-2">
                    <AlertDialogCancel variant="ghost" className="w-full" onClick={() => handleClose(true)}>
                        Cancel
                    </AlertDialogCancel>
                    <Button variant="destructive" className="delete-message-btn w-full" onClick={onSubmit}>
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        ) || (
                            <LordIcon className="mr-2" target=".delete-message-btn" icon="kfzfxczd" size={20} />
                        )}
                        Delete message
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
