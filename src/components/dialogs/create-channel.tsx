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
import { createChannelInServer, createNewServer } from "@/lib/servers";
import { useModal } from "../../../hooks/use-modal-store";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Octagon, X } from "lucide-react";
import { ChannelType } from "@/lib/channel";
export default function CreateChannelDialog() {
    const { isOpen, onClose, modal, modalArgs } = useModal();
    const [isLoading, setIsLoading] = React.useState(false);
    const { profileId, server, onCreated } = modalArgs;
    const FormSchema = z.object({
        name: z.string({
            description: "Channel name",
        }).min(1, {
            message: "Channel name must be at least 2 characters long",
        }).max(10, {
            message: "Channel name must be at most 20 characters long",
        }),
        type: z.string().min(1)
    })
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });
    const isModalOpen = isOpen && modal == "createChannel";
    
    const onSubmit = async ({
        name,
        type
    }: { name: string, type: string }) => {
        let channelType: ChannelType;
        switch (type) {
            case "text":
                channelType = ChannelType.text;
                break;
            case "voice":
                channelType = ChannelType.voice;
                break;
            default:
                channelType = ChannelType.text;
        }
        await createChannelInServer(server, name, channelType, profileId);
        handleClose();
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }

    return (
        <AlertDialog open={isModalOpen} onOpenChange={handleClose}>
            <AlertDialogContent>
                <div className="absolute top-4 right-4">
                    <X className="w-5 h-5 text-white cursor-pointer" onClick={handleClose} />
                </div>
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
                                    Channel name
                                </Label>
                                <FormControl>
                                    <Input
                                        id="name"
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
                    <FormField
                        name="type"
                        control={form.control}
                        render={({ field }) => (
                            <>
                                <Label htmlFor="type">
                                    Channel type
                                </Label>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                required {...field}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Channel type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="text">Text Channel</SelectItem>
                                        <SelectItem value="voice">Voice Channel</SelectItem>
                                    </SelectContent>
                                </Select>
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
