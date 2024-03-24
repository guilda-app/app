import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import qs from "query-string";
import axios from "axios";
import React from "react";
import { useModal } from "../../../hooks/use-modal-store";
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
        try {
            const url = qs.stringifyUrl({
                url: "/api/socket/messages",
            });
            await axios.delete(url, { data: { message } });
        } catch (e) {
            console.error(e);
        }
        handleClose(false);
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
