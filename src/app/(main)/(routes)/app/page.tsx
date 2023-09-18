
"use client";

import React, { useEffect } from "react";
import { getCurrentUser } from "@/lib/session";

export default async function AuthenticationPage() {
  const user = await getCurrentUser();

  return (
    <>
      <div className="container relative hidden h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        APPLICATION HERE!
      </div>
    </>
  )
}

