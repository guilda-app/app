"use client";

import CreateServerDialog from "@/components/dialogs/create-server";
import CreateChannelDialog from "@/components/dialogs/create-channel";
import ServerSettingsDialog from "@/components/dialogs/server-settings";
import DeleteMessageDialog from "../dialogs/delete-message";

export const ModalProvider = () => {
    return (
        <>
            <CreateChannelDialog />
            <CreateServerDialog />
            <ServerSettingsDialog />
            <DeleteMessageDialog />
        </>
    );
}