
import { db } from "@/lib/db";
import { getActivationFromSlug } from "@/lib/profiles";
import { session } from "@/lib/session";
import { redirect } from 'next/navigation';

export async function GET(req: Request,
{ params }: { params: { slug: string } }) {
    const slug = params.slug;
    let activation = await getActivationFromSlug(slug);
    if (!activation)
        return redirect('/sign-up');

    if (activation.forCreation) 
        redirect('/account-creation?id=' + activation.id);
    else {
        const user = await db.user.findUnique({
            where: {
                email: activation.email
            }
        });
        if (!user)
            return redirect('/sign-up');
        else {
            await session(req).set("id", user.id)
          
            // fetch the user and login
            // redirect to the dashboard
            return redirect('/app'); // todo: add device to the list of devices
        }
    }
}