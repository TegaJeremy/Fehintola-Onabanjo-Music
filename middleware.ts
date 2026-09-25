import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

/** Keeps the admin's Supabase login session fresh (cookie refresh). */
async function refreshAdminSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });
  await supabase.auth.getUser();
  return response;
}

export default async function middleware(request: NextRequest) {
  // /en/admin, /yo/admin … → /admin (the admin has no language prefix)
  const localized = request.nextUrl.pathname.match(/^\/(en|yo|ig|ha|pcm)(\/admin(?:\/.*)?)$/);
  if (localized) {
    const url = request.nextUrl.clone();
    url.pathname = localized[2];
    return NextResponse.redirect(url);
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    return refreshAdminSession(request);
  }
  return intlMiddleware(request);
}

export const config = {
  // Skip API routes, Next internals and files with an extension (images etc.)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
