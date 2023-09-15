'use server';

import { SMTPClient } from 'emailjs';
import WelcomeEmail from '@/emails/welcome';
import { EmailTemplate } from '@/lib/constants';

declare global {
    var emailClient: SMTPClient | undefined
}

const emailClient = globalThis.emailClient || new SMTPClient({
    user: process.env.EMAIL_USER,
	password: process.env.EMAIL_PASSWORD,
	host: process.env.EMAIL_HOST,
	ssl: true,
})

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
            return await emailClient.sendAsync({
                from: process.env.EMAIL_USER as string,
                to,
                subject: 'Welcome to guilda!',
                text: WelcomeEmail(to, args),
            });
    }
}

    
