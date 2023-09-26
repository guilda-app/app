"use client";

import "./globals.css";
import 'aos/dist/aos.css';

import AOS from 'aos';
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";

import { config as configurateDotEnv } from 'dotenv';
import { useEffect } from "react";
import { ModalProvider } from "@/components/providers/modal-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SocketProvider } from "@/components/providers/socket-provider";

configurateDotEnv();
const inter = Open_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <html className="dark" lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={inter.className}>
        <TooltipProvider>
          <SocketProvider>
            <ModalProvider />
            {children}
          </SocketProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
