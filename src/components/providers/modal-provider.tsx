"use client";

import CreateServerDialog from "@/components/dialogs/create-server";
import CreateChannelDialog from "@/components/dialogs/create-channel";
import ServerSettingsDialog from "@/components/dialogs/server-settings";

export const ModalProvider = () => {
    return (
        <>
            <CreateServerDialog />
            <CreateChannelDialog />
            <ServerSettingsDialog />
        </>
    );
}