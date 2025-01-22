import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({fetch, url ,}) => {
    const urlRequest = url.searchParams.get('url') as string;

    const result = await fetch(urlRequest);
    const data = await result.json();

    return json({
        code: result.status,
        data,
    });
}

export const PATCH: RequestHandler = async ({fetch, request, url}) => {
 
    const { confirm_url } = await request.json();

    const result = await fetch(confirm_url, {
        method: 'PATCH',
        body: JSON.stringify({
            confirmed: 'VRAIE'
        }),
    });

    return json({
        code: result.status,
        data: await result.json(),
    })
}