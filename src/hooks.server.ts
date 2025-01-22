import type { Handle, HandleFetch } from "@sveltejs/kit";
import { redirect, fail  } from "@sveltejs/kit";
import { auth } from "$lib/auth";

export const handle: Handle = async ({ event, resolve }) => {
  
    const token = auth.getSessionToken(event);

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

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {

  const token = auth.getSessionToken(event);

  const modifiedRequest = new Request(request, {
    headers: {
      ...request.headers,
      Authorization: `Token ${token}`,
      "Content-Type": "application/json"
    }
  });

  return fetch(modifiedRequest);
}