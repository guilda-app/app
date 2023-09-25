
import { db } from "@/lib/db";
import fetchClient from "@/lib/fetch-client";
import { getActivationFromSlug, removeActivation } from "@/lib/profiles";
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

            throw new Error("Not implemented");
            
            await removeActivation(slug);
          
            // fetch the user and login
            // redirect to the dashboard
            return redirect('/app'); // todo: add device to the list of devices
        }
    }
}