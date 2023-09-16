
"use client";

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { createProfile, getActivationFromSlug } from "@/lib/profiles";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { session } from "@/lib/session";
import useUser from "@/lib/useUser";

export default function AuthenticationPage() {
  const router = useRouter();
  const user = useUser(() => router.push("/sign-in"));

  return (
    <>
      <div className="container relative hidden h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        APPLICATION HERE!
      </div>
    </>
  )
}

