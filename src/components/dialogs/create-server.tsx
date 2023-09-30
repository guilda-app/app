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

export default function CreateServerDialog() {
    const { isOpen, onClose, modal, modalArgs } = useModal();
    const [isLoading, setIsLoading] = React.useState(false);
    const { defaultServerName = "", profileId, onCreated, canClose } = modalArgs;
    const FormSchema = z.object({
        name: z.string({
            description: "Server name",
        }).min(2, {
            message: "Server name must be at least 2 characters long",
        }).max(20, {
            message: "Server name must be at most 20 characters long",
        }).default(defaultServerName),
    })
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });
    const isModalOpen = isOpen && modal == "createServer";
    
    const onSubmit = async ({
        name
    }: { name: string }) => {
        setIsLoading(true);
        let server = await createNewServer({name, profileId});
        onCreated?.(server);
        window.location.href = `/app/server/${server.id}`;
        handleClose();
        setIsLoading(false);
    }

    const handleClose = (open: boolean = false) => {
        if (!open) {
            form.reset();
            onClose();
        }
    }

    return (
        <AlertDialog open={isModalOpen} onOpenChange={handleClose}>
            <AlertDialogContent>
                {canClose && (
                    <div className="absolute top-4 right-4">
                        <X className="w-5 h-5 text-white cursor-pointer" onClick={() => handleClose()} />
                    </div>
                )}
                <AlertDialogHeader>
                    <AlertDialogTitle>Create a new server! 🥳</AlertDialogTitle>
                    <AlertDialogDescription>
                        Your server is where your friends hang out. Make yours and start talking!
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Form {...form}>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <>
                                <Label htmlFor="name">
                                    Server name
                                </Label>
                                <FormControl>
                                    <Input
                                        id="name"
                                        placeholder={defaultServerName}
                                        type="text"
                                        autoCapitalize="none"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="my-2 text-red-500" />
                            </>
                        )}
                    />
                </Form>
                <AlertDialogFooter className="mt-2">
                    <AlertDialogAction className="w-full" onClick={form.handleSubmit(onSubmit)}>
                        {isLoading && (
                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        ) || (
                            <span className="mr-2">{"🥳"}</span>
                        )}
                        Create server
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
