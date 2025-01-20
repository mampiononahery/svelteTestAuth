import { auth } from "$lib/auth";
import { AUTH_TOKEN_EXPIRY_SECONDS } from "$lib/constants.server";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
	async default(event) {
		const data = await event.request.formData();
		const email = data.get("email") as string;
		const password = data.get("password") as string;
		const password_confirm = data.get("password-confirm") as string;

		if (!email)
			return fail(422, { email, error: "An email address is required." });
		if (!password)
			return fail(422, { email, error: "A password is required." });
		if (password.length < 8)
			return fail(422, {
				email,
				error: "Password must be at least 8 characters long.",
			});
		if (password.length > 32)
			return fail(422, {
				email,
				error: "Password cannot be more than 32 characters long.",
			});
		
		const signup_resp = await auth.signup({
			email,
			password,
			password_confirm,
			opts: { cookies: event.cookies },
		});

		if (signup_resp.isErr()) {
			const error = (
				String(signup_resp.error) ??
				"There was an issue creating your account. Please try again."
			).trim();
			return fail(500, { email, error });
		}

		// Sign the user in immediately
		const login_resp = await auth.login({
			email,
			password,
			opts: { cookies: event.cookies },
		});

		if (login_resp.isErr()) {
			const error = (
				String(login_resp.error) ?? "Could not sign you in. Please try again."
			).trim();
			return fail(500, { email, error });
		}

		const user = login_resp.value;
		if ( user?.token) {
		
			event.cookies.set("auth_token", user.token, {
				path: "/",
				maxAge: AUTH_TOKEN_EXPIRY_SECONDS,
			});
		}

		delete user.token;
		return { user };
	},
};
