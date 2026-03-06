"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FaFacebookF, FaInstagram, FaTelegramPlane } from "react-icons/fa";
import { getPublicSettings, pickLocalized, type LocaleCode, type PublicSiteSettings } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

function localePath(locale: string, slug = "") {
  return `/${locale}${slug}`;
}

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale() as LocaleCode;
  const [settings, setSettings] = useState<PublicSiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    void (async () => {
      const data = await getPublicSettings();
      if (active && data) setSettings(data);
      if (active) setIsLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  const address = useMemo(() => {
    if (!settings) return t("contact.address");
    return pickLocalized(locale, {
      en: settings.addressEn,
      ru: settings.addressRu,
      uz: settings.addressUz,
    });
  }, [locale, settings, t]);

  const phone = settings?.phone || t("contact.phone");
  const email = settings?.email || t("contact.email");

  return (
    <footer className="border-t border-border/60 bg-muted/20">
      <div className="site-container py-14 md:py-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <p className="text-lg font-bold">{t("brand")}</p>
            <p className="text-sm text-muted-foreground">{t("brandDescription")}</p>
            <div className="flex gap-3">
              <Link href="https://facebook.com" className="rounded-full border p-3 transition-colors hover:bg-muted" aria-label="facebook">
                <FaFacebookF />
              </Link>
              <Link href="https://instagram.com" className="rounded-full border p-3 transition-colors hover:bg-muted" aria-label="instagram">
                <FaInstagram />
              </Link>
              <Link href="https://t.me" className="rounded-full border p-3 transition-colors hover:bg-muted" aria-label="telegram">
                <FaTelegramPlane />
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-semibold">{t("exams.title")}</p>
            <Link href={localePath(locale, "/courses")} className="block text-sm text-muted-foreground hover:text-foreground">
              {t("exams.ielts")}
            </Link>
            <Link href={localePath(locale, "/courses")} className="block text-sm text-muted-foreground hover:text-foreground">
              {t("exams.sat")}
            </Link>
            <Link href={localePath(locale, "/courses")} className="block text-sm text-muted-foreground hover:text-foreground">
              {t("exams.gmat")}
            </Link>
            <Link href={localePath(locale, "/courses")} className="block text-sm text-muted-foreground hover:text-foreground">
              {t("exams.pte")}
            </Link>
          </div>

          <div className="space-y-3">
            <p className="font-semibold">{t("company.title")}</p>
            <Link href={localePath(locale, "/about")} className="block text-sm text-muted-foreground hover:text-foreground">
              {t("company.about")}
            </Link>
            <Link href={localePath(locale, "/results")} className="block text-sm text-muted-foreground hover:text-foreground">
              {t("company.success")}
            </Link>
            <Link href={localePath(locale, "/teachers")} className="block text-sm text-muted-foreground hover:text-foreground">
              {t("company.careers")}
            </Link>
            <Link href={localePath(locale, "/contact")} className="block text-sm text-muted-foreground hover:text-foreground">
              {t("company.contact")}
            </Link>
          </div>

          <div className="space-y-3">
            <p className="font-semibold">{t("contact.title")}</p>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">{address}</p>
                <Link href={`tel:${phone.replace(/\s+/g, "")}`} className="block text-sm text-muted-foreground hover:text-foreground">
                  {phone}
                </Link>
                <Link href={`mailto:${email}`} className="block text-sm text-muted-foreground hover:text-foreground">
                  {email}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

