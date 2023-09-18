import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const jwt = {
  decode: (token: string | undefined) => {
    if (!token) return;

    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
  },
};
