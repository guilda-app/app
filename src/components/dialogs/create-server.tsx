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
import { Server } from "@prisma/client";

export default function CreateServerDialog({
    openByDefault = false,
    defaultServerName = "",
    profileId,
    onCreated,
}: {
    openByDefault?: boolean;
    defaultServerName?: string;
    profileId: string;
    onCreated?: (server: Server) => void;
}) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(openByDefault);
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
    
    const onSubmit = async ({
        name
    }: { name: string }) => {
        setIsLoading(true);
        let server = await createNewServer({name, profileId});
        setIsOpen(false);
        setIsLoading(false);
        onCreated?.(server);
    }

    return (
        <AlertDialog defaultOpen={openByDefault} open={isOpen}>
            <AlertDialogContent>
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
                                <FormControl className="mt-2">
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
                    <AlertDialogAction onClick={form.handleSubmit(onSubmit)}>Create server</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
