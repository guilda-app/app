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

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

async function sendEmailToUser(to: string) {
  return await sendEmail({
    to, 
    template: EmailTemplate.AccountConfirmation,
    args: {
      confirmationLink: `${process.env.NEXT_PUBLIC_APP_URL}/confirm-account`
    }
  });
}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [result, setResult] = React.useState<any>(null);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    let result = sendEmailToUser((event.target as any).email.value);
    setIsLoading(false);

    setResult(result);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <span className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
          </span>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
          {result && (
            <Alert className="mt-4" variant="destructive">
              {result}
            </Alert>
          )}
        </div>
      </form>
    </div>
  );
}
