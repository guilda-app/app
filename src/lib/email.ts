'use server';

import { SMTPClient } from 'emailjs';
import WelcomeEmail from '@/emails/welcome';
import { EmailTemplate } from '@/lib/constants';
import { Resend } from 'resend';


declare global {
    var emailClient: SMTPClient | undefined
}

const emailClient = globalThis.emailClient || new Resend(process.env.RESEND_KEY as string)

if (process.env.NODE_ENV === 'development') {
    globalThis.emailClient = emailClient
}

export async function sendEmail({
    to,
    template,
    args
}: {
    to: string;
    template: number;
    args: any;
}) {
    switch (template) {
        case EmailTemplate.AccountConfirmation:
            return emailClient.emails.send({
                from: process.env.EMAiL_FROM as string,
                to,
                subject: 'Welcome to guilda!',
                html: WelcomeEmail(to, args),
            });
    }
}

    
