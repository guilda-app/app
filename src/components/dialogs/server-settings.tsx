import React, { useEffect } from "react";
import { useModal } from "../../../hooks/use-modal-store";
import { Loader2Icon, RouterIcon, X } from "lucide-react";
import { Dialog, DialogContent } from "../ui/dialog";
import Section from "../ui/navigation/section";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import LordIcon from "../ui/lord-icon";
import { Button } from "../ui/button";
import { Server } from "@prisma/client";
import { AlertDialog, AlertDialogContent } from "../ui/alert-dialog";
import { useToast } from "../ui/use-toast";
import { db } from "@/lib/db";
import updateServerInfo from "@/lib/update-server-info";
import { updateServerSettings } from "@/lib/servers";
import uploadFile from "@/lib/upload-file";

enum PageType {
    General,
}

export default function ServerSettingsDialog() {
    const { isOpen, onClose, modal, modalArgs } = useModal();
    const [isLoading, setIsLoading] = React.useState(false);
    const [page, setPage] = React.useState<PageType>(PageType.General);
    const { server } = modalArgs;
    const isModalOpen = isOpen && modal == "serverSettings";
    const [serverCopy, setServerCopy] = React.useState<Server | null>(server);
    const [doNotExitAsClass, setdoNotExitAsClass] = React.useState(false);
    const [serverImage, setServerImage] = React.useState("");
    const needsSaving = JSON.stringify(serverCopy) !== JSON.stringify(server);
    const { toast } = useToast();

    const onSubmit = async () => {
        setIsLoading(true);

        await updateServerSettings(server.id, serverCopy as Server);
        await updateServerInfo(server.id);
        
        setdoNotExitAsClass(false);
        handleClose(false, true);
        setIsLoading(false);
        toast({
            title: "Server settings saved!",
            description: "Your server settings have been saved.",
        });
    }

    const handleClose = (open: boolean = false, forCancel: boolean = false) => {
        if (!open) {
            if (needsSaving && !forCancel) {
                setTimeout(() => {
                    if (!doNotExitAsClass)
                        setdoNotExitAsClass(false);
                }, 400);
                setdoNotExitAsClass(true);
            } else {
                onClose();
            }
        }
    }

    useEffect(() => {
        setServerCopy(server);
        setServerImage(!server ? "" : server.imageUri);
    }, [server]);

    return server ? (
        <AlertDialog open={isModalOpen} onOpenChange={handleClose}>
            <AlertDialogContent className="!w-3/6 h-4/5 max-w-none max-h-none flex">
                <div className="absolute top-4 right-4">
                    <X className="w-5 h-5 text-white cursor-pointer" onClick={() => handleClose()} />
                </div>
                <div className="flex w-full">
                    <div className="border-r flex flex-col h-full pr-5 pt-8 w-60 pl-1 min-w-60">
                        <Section text="Basic configuration" />
                        <div onClick={() => setPage(PageType.General)} className={
                            cn("anim-icon mb-1 relative select-none flex items-center overflow-hidden text-muted-foreground cursor-pointer transition-all duration-150 rounded-sm hover:bg-zinc-900 px-3 py-2 my-1",
                                page == PageType.General ? "bg-zinc-900" : ""
                            )}>
                            <LordIcon target=".anim-icon" icon="isugonwi" className="mr-3" size={20} />
                            <div className="!p-0 truncate text-sm font-semibold">Overview</div>
                        </div>
                        <div className="w-full flex-1 pt-4 flex items-end justify-end">
                            <Button variant={"ghost"} onClick={() => handleClose(false, true)} className="mr-2">Cancel</Button>
                            <Button onClick={onSubmit} disabled={!needsSaving} className={cn("anim-icon ml-2 w-full", doNotExitAsClass ? "they-are-trying-to-scape-without-saving-👹" : "")}>
                                {isLoading && (
                                    <div className="flex flex-row items-center">
                                        <div className="mr-2">
                                            <Loader2Icon className="h-4 w-4 animate-spin" />
                                        </div>
                                        <div>
                                            Saving...
                                        </div>
                                    </div>
                                ) || (
                                    <div className="flex flex-row items-center">
                                        <LordIcon target=".anim-icon" icon="ndppaqfb" className="mr-2" size={24} />
                                        <div>
                                            Save
                                        </div>
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>
                    <div className="ml-12 mt-8 flex-1 pr-12 relative overflow-auto">
                        {page == PageType.General && (
                            <>
                                <div className="flex flex-col select-none cursor-default">
                                    <div className="flex flex-row items-center">
                                        <h1 className="text-white text-2xl font-bold">Server configuration</h1>
                                    </div>
                                    <div className="flex flex-row items-center">
                                        <p className="text-white text-sm">Configure your server to your liking.</p>
                                    </div>
                                </div>
                                <div className="h-12"></div>
                                <div className="flex flex-col w-full justify-between">
                                    <div>
                                        <div className="text-base font-bold select-none cursor-default">
                                            Name
                                        </div>
                                        <div className="text-sm text-muted-foreground font-normal select-none cursor-default w-max-12">
                                            The name of your server that will be displayed in the server list.
                                        </div>
                                    </div>
                                    <div className="pt-4 w-full">
                                        <Input
                                            name="name"
                                            placeholder="Server name"
                                            defaultValue={server.name}
                                            onInput={(e) => {
                                                setServerCopy((prevState: any) => {return {
                                                    ...prevState,
                                                    name: e.target.value
                                                } as Server});
                                            }}
                                        />
                                    </div>
                                </div>
                                <Separator className="my-8" />
                                <div className="text-base font-bold select-none cursor-default">
                                    Server picture
                                </div>
                                <div className="text-sm text-muted-foreground font-normal select-none cursor-default w-max-12">
                                    The picture of your server that will be displayed in the server list.
                                </div>
                                <div className="flex w-full">
                                    <div className="flex items-center">
                                        <div className="mt-5 ml-8">
                                            <Avatar className="w-12 h-12">
                                                <AvatarImage src={serverImage} />
                                            </Avatar>
                                        </div>
                                    </div>
                                    <div className="pt-4 ml-12 w-full">
                                        <div className="text-xs mb-2 font-normal select-none cursor-default w-max-12">
                                            We recommend using a 521 x 521 image for best results.
                                        </div>
                                        <Input
                                            name="picture"
                                            type="file"
                                            className="cursor-pointer w-3/4"
                                            accept="image/*"
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (!file) return;

                                                const upload = await uploadFile(file);
                                                if (!upload) return;

                                                setServerImage(upload);
                                                setServerCopy((prevState: any) => {return {
                                                    ...prevState,
                                                    imageUri: upload
                                                } as Server});
                                            }}
                                        />
                                    </div>
                                </div>
                                <Separator className="my-8" />
                                <div className="flex flex-col w-full justify-between">
                                    <div>
                                        <div className="text-base font-bold select-none cursor-default">
                                            Server description
                                        </div>
                                        <div className="text-sm text-muted-foreground font-normal select-none cursor-default w-max-12">
                                            A description of your server that will be displayed in the server list.
                                        </div>
                                    </div>
                                    <div className="pt-4 w-full">
                                        <Textarea
                                            className="resize-none h-32"
                                            name="description"
                                            placeholder="Server description"
                                            defaultValue={server.description}
                                            onInput={(e) => {
                                                setServerCopy((prevState: any) => {return {
                                                    ...prevState,
                                                    description: e.target.value
                                                } as Server});
                                            }}
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    ) : null;
}
