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
import { updateCookies } from "@/lib/cookies";
import useUser from "@/lib/useUser";
import fetchJson from "@/lib/fetchJSON";

export default function AuthenticationPage() {
  const router = useRouter();
  let query = useSearchParams();

  useUser(() => router.push("/app"), true);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState("");

  let verificationId = query.get("id") as string;

  React.useEffect(() => {
    if (verificationId) {
      getActivationFromSlug(verificationId).then((activation) => {
        if (activation) {
          setEmail(activation.email);
        } else router.push("/sign-up");
      })
    } else router.push("/sign-up");
  }, [verificationId]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    await createProfile({
      email,
      name: e.currentTarget.username.value,
    });
    
    await fetchJson("/api/activate-for-code-id", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        activationId: verificationId,
      }),
    });

    router.push("/app");
  }

  return (
    <>
      <div className="container relative hidden h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <Link href="/" className="relative w-fit z-20 flex items-center text-lg font-medium">
            <Icons.logo className="h-10 w-10 mr-5" />
            Guilda - app
          </Link>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
                <p className="text-lg">
                &ldquo;The perfect application to chat and hang around with people.&rdquo;
                </p>
                <footer className="text-sm">Mauro Baladés</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
                <h1 data-aos="fade-down" data-aos-delay="100" className="text-2xl font-semibold tracking-tight">
                Finish your account creation!
                </h1>
                <p data-aos="fade-down" className="text-sm text-muted-foreground">
                Enter your username below to finish your account creation
                </p>
            </div>
            <div className={cn("grid gap-6")}>
              <form onSubmit={onSubmit}>
                <div className="grid gap-2">
                  <Label className="mt-2" data-aos="fade-right" data-aos-delay="150" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={true}
                    value={email}
                    data-aos="fade-right" 
                    data-aos-delay="200"
                  />
                  <Label data-aos="fade-right" data-aos-delay="250" className="mt-4" htmlFor="username">
                    Username
                  </Label>
                  <Input
                    id="username"
                    placeholder="my-really-cool-username"
                    type="text"
                    autoCapitalize="none"
                    autoCorrect="off"
                    disabled={isLoading}
                    data-aos="fade-right"
                    data-aos-delay="300"
                  />
                  <Button className="mt-4" disabled={isLoading} data-aos="fade-up" data-aos-delay="400">
                    {isLoading && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) || (
                      <span className="mr-2">{"🥳"}</span>
                    )}
                    Create new account!
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
