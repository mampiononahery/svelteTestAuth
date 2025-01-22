
import { AUTH_TOKEN_EXPIRY_SECONDS } from "$lib/constants.server";
import type { Cookies } from "@sveltejs/kit";
import { err, ok } from "neverthrow";

const BASE_URL= 'https://hire-game.pertimm.dev/api/v1.1/';


export const cookie: AuthAdapter = {
    async validate_session({ token, opts }) {
		if (!opts?.cookies) throw new Error("must pass cookies in to options");
		if (!token) return err(new Error("no token provided"));

       // user is stored in cookies
       const user = getUsers(opts.cookies);
   
        // verify user cookies
       if (user?.token !== token){
        return err(new Error("no user found"));
       }

        if (!user) return err(new Error("no user found"));
        return ok(user);
    },
    async login({ email, password, opts }) {
        const url = BASE_URL + 'auth/login/';
        const request = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                email,
                password
            }),
            headers: { "Content-Type": "application/json" },
        });
     

        if (!request.ok) {
            return err(new Error("Invalid email or password"));
        }

        const user =  await request.json();
        // set user in cookies
        set_users(opts.cookies, user);
        return ok(user);
    },
    async signup({ email, password, password_confirm, opts }) {

        const url = BASE_URL + 'auth/register/';
        try {
            const request = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    password1: password,
                    password2: password_confirm
                }),
                headers: { "Content-Type": "application/json" },
            });
            const user =  await request?.json();
            console.log('user', user);
            //set user in cookies
            set_users(opts.cookies, user);
            return ok(user);
        } catch (error) {
            return err(new Error("serveur error or  user already exist"));
        }
       
    },
    async logout({ token, opts }) {
        if (!opts?.cookies)
			return err(new Error("must pass cookies in to options"));
		//  const token = cookies.get("auth_token") as string;
		opts.cookies.delete("auth_token", { path: "/" });
       
		// Remove token from the user
		set_users(
			opts.cookies,
			{token: '', email: ''}
		);

		return;
    },
    getSessionToken(event){
    const token =  event.cookies.get("auth_token") as string;
    return token;
}
}

function set_users(cookies: Cookies, users: User[]) {
	cookies.set("users", JSON.stringify(users), { path: "/", maxAge: AUTH_TOKEN_EXPIRY_SECONDS });
}

function getUsers( cookies: Cookies): User[] {
    const storedUser = cookies.get("users");
	return JSON.parse(storedUser || '');
	
}