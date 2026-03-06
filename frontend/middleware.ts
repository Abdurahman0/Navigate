import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { defaultLocale, locales } from "./i18n/routing";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always"
});

export default function middleware(request: Parameters<typeof intlMiddleware>[0]) {
  const { pathname } = request.nextUrl;
  const adminMatch = pathname.match(/^\/(en|ru|uz)\/admin(?:\/.*)?$/);

  if (adminMatch) {
    const locale = adminMatch[1];
    const isLoginPage = pathname === `/${locale}/admin/login`;
    const token = request.cookies.get("admin_session")?.value;

    if (!isLoginPage && !token) {
      return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/", "/(en|ru|uz)/:path*"]
};
