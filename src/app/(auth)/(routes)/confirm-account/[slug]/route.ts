
import { db } from "@/lib/db";
import { getActivationFromSlug } from "@/lib/profiles";
import { redirect } from 'next/navigation';

export async function GET(req: Request,
{ params }: { params: { slug: string } }) {
    const slug = params.slug;
    let activation = await getActivationFromSlug(slug);
    if (!activation)
        return redirect('/register');

    if (activation.forCreation) 
        redirect('/account-creation?id=' + activation.id);
    else {
        const user = await db.user.findUnique({
            where: {
                email: activation.email
            }
        });
        if (!user)
            return redirect('/register');
        else {
            return redirect(`/login?slug=${slug}`); // todo: add device to the list of devices
        }
    }
}