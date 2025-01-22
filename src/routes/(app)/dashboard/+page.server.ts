import { fail } from "@sveltejs/kit";
import type { PageServerLoad } from "../../logout/$types"
import type { Actions } from "./$types";
import { env } from "$env/dynamic/public";

export const load: PageServerLoad = async ({  locals, fetch  }) => {
	const { user } = locals;
	return user;
}

export const actions: Actions = {
	async createRequestApplication({fetch, request}) {
		const data = await request.formData();
		const email = data.get("email") as string;
		const first_name = data.get("first_name") as string;
		const last_name = data.get("last_name") as string;

		if (!email)
			return fail(422, { email, error: "An email address is required." });
		if (!first_name)
			return fail(422, { first_name, error: "A firstName is required." });
		if (!last_name)
			return fail(422, { last_name, error: "A lastName is required." });

		const result = await fetch(env.PUBLIC_API_BASE_URL+'job-application-request/', {
			method: 'POST',
			body: JSON.stringify({
				email,
				first_name,
				last_name
			}),
		});
		const requestModel = await result.json();
		return {requestModel}
	}
}


