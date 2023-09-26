"use client";

import CreateServerDialog from "@/components/dialogs/create-server";
import CreateChannelDialog from "../dialogs/create-channel";

export const ModalProvider = () => {
    return (
        <>
            <CreateServerDialog />
            <CreateChannelDialog />
        </>
    );
}