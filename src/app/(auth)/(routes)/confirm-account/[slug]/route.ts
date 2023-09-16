
import { db } from "@/lib/db";
import { getActivationFromSlug } from "@/lib/profiles";
import { redirect } from 'next/navigation';

export async function GET(req: Request,
{ params }: { params: { slug: string } }) {
    const slug = params.slug;
    let activation = await getActivationFromSlug(slug);
    if (!activation)
        return redirect('/sign-up');

    if (activation.forCreation) 
        redirect('/account-creation?id=' + activation.id);
    else
        throw new Error('TODO: implement account signin');
}