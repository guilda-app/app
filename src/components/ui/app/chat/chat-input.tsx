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
import { PlusIcon, SmilePlus } from "lucide-react";
import qs from "query-string";
import axios from "axios";

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
                                <div className="relative p-2 pb-6 pt-0 flex items-center">
                                    <button style={{ transform: 'translateX(170%)' }} type="button" onClick={() => {}} className=" border ml-1 h-[24px] w-[24px] bg-zinc-900 hover:bg-zinc-800 transitipon rounded-full p-1 flex items-center justify-center">
                                        <PlusIcon className="w-5 h-5 text-white" />
                                    </button>
                                    <Input
                                        disabled={isLoading}
                                        className="px-14 py-6 bg-zinc-950 border focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-200"
                                        placeholder={`Message in #${name}!`}
                                        autoComplete="off"
                                        {...field}
                                    />
                                    <div style={{ transform: 'translateX(-200%)' }}>
                                        <SmilePlus className="w-5 h-5 text-white cursor-pointer" />
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
