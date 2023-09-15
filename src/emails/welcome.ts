
export default function(to: string, args: { confirmationLink: string }) {
    return `
    <html>
        <body>
            <p>Hi there!</p>
            <p>Thanks for signing up for guilda! Please confirm your email address by clicking the link below:</p>
            <a href="${args.confirmationLink}">Confirm your email</a>
        </body>
    </html>
`;
}
