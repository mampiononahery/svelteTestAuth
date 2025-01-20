import type { Handle } from "@sveltejs/kit";
import { redirect, fail  } from "@sveltejs/kit";
import { auth } from "$lib/auth";

export const handle: Handle = async ({ event, resolve }) => {
  
    const token = event.cookies.get("auth_token") as string;

    if (token) {
      const resp = await auth.validate_session({
        token,
        opts: { cookies: event.cookies },
      });
    
      if (resp?.isOk()) {
        event.locals.user = resp.value;
        // go to dasbhoard
        if (event.route.id==='/') {
          throw redirect(302, "/dashboard");
        }
      } else {
        if (!token && event.route.id?.startsWith("/(app)")) {
          throw redirect(302, "/login");
        }
      }
    }
    // protect routes
    if (!token && event.route.id?.startsWith("/(app)")) {
      throw redirect(302, "/");
    }
  
    return resolve(event);
}