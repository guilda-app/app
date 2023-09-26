"use client";

import "./globals.css";
import 'aos/dist/aos.css';

import AOS from 'aos';
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { config as configurateDotEnv } from 'dotenv';
import { useEffect } from "react";
import { ModalProvider } from "@/components/providers/modal-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

configurateDotEnv();
const inter = Inter({ subsets: ["latin"] });

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
          <ModalProvider />
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
