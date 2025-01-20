import { auth } from "$lib/auth";
import { AUTH_TOKEN_EXPIRY_SECONDS } from "$lib/constants.server";
import type { Actions } from "@sveltejs/kit";
import { fail , redirect } from "@sveltejs/kit";
import { err } from "neverthrow";

export const actions: Actions = {
    async default(event) {
        const data = await event.request.formData();
		const email = data.get("email") as string;
		const password = data.get("password") as string;
        
        const resp = await auth.login({
			email,
			password,
			opts: { cookies: event.cookies },
		});


		if (resp.isErr()) {
			const error = (
				String(resp.error) ??
				"No account with that email or username could be found."
			).trim();
			return fail(401, { email, error });
		}

        const user = resp.value;
        if (user?.token) {
			event.cookies.set("auth_token", user.token, {
				path: "/",
				maxAge: AUTH_TOKEN_EXPIRY_SECONDS,
			});
		}

		delete user.token;
		return { user };
    }
}