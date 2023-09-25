"use client";

import "./globals.css";
import 'aos/dist/aos.css';

import AOS from 'aos';
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { config as configurateDotEnv } from 'dotenv';
import { useEffect } from "react";

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
      <body suppressHydrationWarning className={inter.className}>{children}</body>
    </html>
  );
}
