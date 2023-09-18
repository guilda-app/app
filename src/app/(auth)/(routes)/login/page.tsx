"use client";
import Link from "next/link"

import { cn } from "@/lib/utils"
import { UserAuthForm } from "@/components/auth-form"
import { Icons } from "@/components/icons"

export default async function AuthenticationPage() {
  return (
    <>
      <div className="container relative hidden h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
            href="/sign-up"
            className={cn(
              "absolute font-bold right-4 top-4 md:right-8 md:top-8"
            )}
        >
            Create account
        </Link>
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
                Nice to see you again!
                </h1>
                <p data-aos="fade-down" className="text-sm text-muted-foreground">
                Enter your email below to sign into your account
                </p>
            </div>
            <UserAuthForm isSignUp={false} />
          </div>
        </div>
      </div>
    </>
  )
}
