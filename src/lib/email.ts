'use server';

import WelcomeEmail from '@/lib/emails/welcome';
import { EmailTemplate } from '@/lib/constants';
import Plunk from '@plunk/node';

declare global {
    var emailClient: Plunk | undefined
}

const emailClient = globalThis.emailClient || new Plunk(process.env.PLUNK_KEY as string)

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
                to,
                subject: 'Welcome to guilda!',
                body: WelcomeEmail(to, args),
            });
    }
}

    
