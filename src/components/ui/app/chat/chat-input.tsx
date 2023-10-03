"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AtSignIcon, Mic2Icon, MicIcon, PaperclipIcon, PlusCircleIcon, PlusIcon, SendIcon, SmilePlus } from "lucide-react";
import qs from "query-string";
import axios from "axios";
import { Separator } from "../../separator";
import { ActionTooltip } from "../../action-tooltip";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    content: z.string().min(1),
});

export default function({ apiUrl, query, name }: {
    apiUrl: string;
    query: Record<string, string>;
    name: string;
}) {
    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            content: "",
        },
        resolver: zodResolver(formSchema),
    });

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl,
                query,
            });
            form.reset();
            await axios.post(url, values);
        } catch (e) {
            console.error(e);
        }
    }
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative mx-14 my-6 mt-1 bg-zinc-950 border p-1 px-2 rounded-lg">
                                    <Input
                                        disabled={isLoading}
                                        className="focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-200 border-0 pb-0 mt-1 bg-transparent"
                                        placeholder={`Message in #${name}!`}
                                        autoComplete="off"
                                        {...field}
                                    />
                                    <div className="flex mt-1 py-1 w-full items-center justify-end text-muted-foreground">
                                        <ActionTooltip label="Send voice message" side="top">
                                            <MicIcon className="w-4 h-4 cursor-pointer" />
                                        </ActionTooltip>
                                        <ActionTooltip label="Insert attachment" side="top">
                                            <PaperclipIcon className="w-4 h-4 cursor-pointer ml-3" />
                                        </ActionTooltip>
                                        <Separator className="h-6 w-[1px] mx-3 my-0" />
                                        <ActionTooltip label="Mention someone in the server" side="top">
                                            <AtSignIcon className="w-4 h-4 cursor-pointer" />
                                        </ActionTooltip>
                                        <ActionTooltip label="Insert an emoji" side="top">
                                            <SmilePlus className="w-4 h-4 cursor-pointer ml-3" />
                                        </ActionTooltip>
                                        <ActionTooltip label="Send message" side="top">
                                            <SendIcon onClick={form.handleSubmit(onSubmit)} className={cn("w-4 h-4 cursor-pointer mx-3", !form.getFieldState("content").isDirty ? "cursor-not-allowed" : "")} />
                                        </ActionTooltip>  
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}
