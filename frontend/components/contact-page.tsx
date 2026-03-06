"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FaClock, FaMapMarkerAlt, FaPhoneAlt, FaPlane } from "react-icons/fa";
import { getPublicSettings, pickLocalized, type LocaleCode, type PublicSiteSettings } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LeadCaptureForm } from "./lead-capture-form";

const infoKeys = ["phone", "telegram", "address", "hours"] as const;
const infoIcons = [FaPhoneAlt, FaPlane, FaMapMarkerAlt, FaClock];

export function ContactPage() {
  const t = useTranslations("contactPage");
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
    if (!settings) return t("sidebar.address.detail");
    return pickLocalized(locale, {
      en: settings.addressEn,
      ru: settings.addressRu,
      uz: settings.addressUz,
    });
  }, [locale, settings, t]);

  const workingHours = useMemo(() => {
    if (!settings) return t("sidebar.hours.detail");
    return pickLocalized(locale, {
      en: settings.workingHoursEn,
      ru: settings.workingHoursRu,
      uz: settings.workingHoursUz,
    });
  }, [locale, settings, t]);

  return (
    <main className="bg-background text-foreground">
      <section className="bg-background py-14 md:py-20">
        <div className="site-container space-y-4 text-left">
          <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            {t("hero.titleStart")} <span className="text-primary">{t("hero.titleHighlight")}</span>
          </h1>
          <p className="max-w-2xl text-muted-foreground">{t("hero.subtitle")}</p>
        </div>
      </section>

      <section className="bg-muted/10 py-14 md:py-20">
        <div className="site-container grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr] lg:gap-8">
          <div className="space-y-4">
            {infoKeys.map((key, index) => {
              const Icon = infoIcons[index];
              const detail =
                key === "phone"
                  ? settings?.phone || t("sidebar.phone.detail")
                  : key === "telegram"
                    ? settings?.telegram || t("sidebar.telegram.detail")
                    : key === "address"
                      ? address
                      : workingHours;

              return (
                <Card key={key} className="rounded-2xl bg-card">
                  <CardContent className="flex items-start gap-4 p-5">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="space-y-1">
                      <p className="font-semibold">{t(`sidebar.${key}.title`)}</p>
                      <p className="text-sm text-muted-foreground">{t(`sidebar.${key}.description`)}</p>
                      {isLoading ? <Skeleton className="h-4 w-32" /> : <p className="text-sm font-semibold text-primary">{detail}</p>}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="rounded-3xl bg-card/90 p-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-3xl font-bold tracking-tight">{t("form.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <LeadCaptureForm source="contact" variant="compact" />
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-background py-14 md:py-20">
        <div className="site-container">
          <div className="relative h-64 overflow-hidden rounded-3xl shadow-sm sm:h-72 md:h-[28rem]">
            <iframe
              title={t("map.title")}
              src="https://www.google.com/maps?q=Level%205%2C%20Education%20Plaza%2C%20London&output=embed"
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <Card className="absolute bottom-4 left-4 rounded-xl bg-card/95 shadow-md">
              <CardContent className="space-y-1 p-4">
                <p className="text-sm font-semibold">{t("map.labelTitle")}</p>
                {isLoading ? <Skeleton className="h-3 w-40" /> : <p className="text-xs text-muted-foreground">{address}</p>}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}

