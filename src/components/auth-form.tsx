"use client"
import * as React from "react";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { sendEmail } from "@/lib/email";
import { EmailTemplate } from '@/lib/constants';
import { getVerificationCode } from '@/lib/profiles';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormMessage,
  FormField,
  FormDescription,
} from "@/components/ui/form"
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import ConfettiExplosion from 'react-confetti-explosion';
import useUser from "@/lib/useUser";

const FormSchema = z.object({
  email: z.string().email().min(5),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  isSignUp: boolean;
}

async function sendEmailToUser(to: string, isSignUp: boolean = true) {
  const code = await getVerificationCode(to, isSignUp);
  return await sendEmail({
    to, 
    template: EmailTemplate.AccountConfirmation,
    args: {
      confirmationLink: `https://${typeof window !== 'undefined' ? window.location.hostname : '<ERROR>'}/confirm-account/${code.id}`
    }
  });
}

export function UserAuthForm({ className, isSignUp, ...props }: UserAuthFormProps) {
  useUser({
    redirectTo: '/app',
    redirectIfFound: true,
  });

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [result, setResult] = React.useState("");
  const [responseStatusCode, setStatusCode] = React.useState<number>(0);
  const [email, setEmail] = React.useState("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit({email}: {email: string}) {
    setIsLoading(true);
    setEmail(email);

    try {
      await sendEmailToUser(email);
      setStatusCode(200);
      setResult("ok")
    } catch (error) {
      setStatusCode(505);
      setResult("Something went wrong. Please try again later.");
      console.error(error);
    }
    setIsLoading(false);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <>
                <Label className="sr-only" htmlFor="email">
                  Email
                </Label>
                <FormControl className="grid gap-1">
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="my-2 text-red-500" />
              </>
            )}
          />
            <Button disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) || (
                <Icons.email className="mr-2 h-4 w-4" />
              )}
              {isSignUp ? "Sign Up" : "Sign In"} with Email
            </Button>
            {result && (
              <>
                {(responseStatusCode === 200) ? (
                  <>
                    <AlertDialog open={true} defaultOpen={true}>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Email sent successfully!</AlertDialogTitle>
                          <AlertDialogDescription>
                            Please check your email (<b>{email}</b>) to confirm your account.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <ConfettiExplosion className="absolute top-50 left-48" width={1700} force={0.6} zIndex={1} />
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                ) : (
                  <Alert className="mt-4" variant="destructive">
                    {result}
                  </Alert>
                )}
              </>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
