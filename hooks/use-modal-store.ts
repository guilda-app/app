
import { create } from "zustand";

export type ModalType = "createServer" | "createChannel" | "serverSettings" | "deleteMessage";

interface ModalStore {
    modal: ModalType | null;
    isOpen: boolean;
    onOpen: (modal: ModalType, args: Record<string, any>) => void;
    onClose: () => void;
    modalArgs: Record<string, any>;
}

export const useModal = create<ModalStore>((set) => ({
    modal: null,
    isOpen: false,
    onOpen: (modal, args = {}) => set({ modal, isOpen: true, modalArgs: args }),
    onClose: () => set({ modal: null, isOpen: false, modalArgs: {} }),
    modalArgs: {},
}));
