import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isValidLocale } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;
  const requestedLocale = locale && isValidLocale(locale) ? locale : defaultLocale;

  return {
    locale: requestedLocale,
    messages: (await import(`../messages/${requestedLocale}.json`)).default
  };
});
