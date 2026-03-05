"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import ReactCountryFlag from "react-country-flag";
import { useLocale, useTranslations } from "next-intl";
import { FiChevronDown } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { locales, type Locale } from "@/i18n/routing";

const languageConfig: Record<Locale, { code: string; country: string }> = {
  en: { code: "EN", country: "US" },
  ru: { code: "RU", country: "RU" },
  uz: { code: "UZ", country: "UZ" },
};

function getLocalePath(pathname: string, targetLocale: Locale) {
  const segments = pathname.split("/");

  if (segments.length > 1 && locales.includes(segments[1] as Locale)) {
    segments[1] = targetLocale;
  } else {
    segments.splice(1, 0, targetLocale);
  }

  let nextPath = segments.join("/").replace(/\/+/g, "/");
  if (nextPath.length > 1 && nextPath.endsWith("/")) {
    nextPath = nextPath.slice(0, -1);
  }

  return nextPath;
}

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("navbar");

  const current = languageConfig[locale] ?? languageConfig.en;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-10 min-w-[84px] gap-2"
          aria-label={t("languageLabel")}
        >
          <ReactCountryFlag
            countryCode={current.country}
            svg
            style={{ width: "1rem", height: "1rem" }}
            aria-hidden
          />
          <span className="text-xs font-semibold sm:text-sm">{current.code}</span>
          <FiChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {locales.map(itemLocale => {
          const cfg = languageConfig[itemLocale];
          const path = getLocalePath(pathname || "/", itemLocale);
          const query = searchParams?.toString();
          const href = query ? `${path}?${query}` : path;

          return (
            <DropdownMenuItem key={itemLocale} asChild>
              <Link href={href} className="cursor-pointer gap-2">
                <ReactCountryFlag
                  countryCode={cfg.country}
                  svg
                  style={{ width: "1rem", height: "1rem" }}
                  aria-hidden
                />
                <span>{t(`languages.${itemLocale}`)}</span>
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
