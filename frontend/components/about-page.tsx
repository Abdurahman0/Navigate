"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  FaArrowRight,
  FaBook,
  FaBullseye,
  FaChartLine,
  FaCheckCircle,
  FaGlobe,
  FaLayerGroup,
  FaRegLightbulb,
  FaShieldAlt,
  FaStar,
  FaUserGraduate,
  FaUsers,
} from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadCaptureForm } from "./lead-capture-form";

const valueItems = ["excellence", "results", "access", "guidance"] as const;
const valueIcons = [FaStar, FaChartLine, FaGlobe, FaRegLightbulb];

const statItems = ["admission", "partners", "gmat", "sat"] as const;
const achievementCards = ["global", "certified"] as const;

const environmentItems = ["mentor", "classroom", "faculty"] as const;

const whyItems = ["ielts", "groups", "mocks", "writing", "materials"] as const;
const whyIcons = [FaBook, FaUsers, FaChartLine, FaUserGraduate, FaLayerGroup];

const journeyBenefits = ["diagnostic", "portfolio", "strategy"] as const;

export function AboutPage() {
  const t = useTranslations("aboutPage");
  const locale = useLocale();

  return (
    <main className="bg-background text-foreground">
      <section className="bg-background py-14 md:py-20">
        <div className="site-container space-y-4 text-left">
          <Badge className="w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary dark:border-primary/25 dark:bg-primary/15">
            {t("hero.badge")}
          </Badge>
          <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            {t("hero.titleStart")} <span className="text-primary">{t("hero.titleHighlight")}</span> {t("hero.titleEnd")}
          </h1>
          <p className="max-w-2xl text-muted-foreground">{t("hero.subtitle")}</p>
        </div>
      </section>

      <section className="bg-muted/10 py-14 md:py-20">
        <div className="site-container grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1400&q=80"
              alt={t("mission.imageAlt")}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-6 left-6 rounded-xl bg-red-600 px-5 py-3 text-white shadow-lg">
              <p className="text-2xl font-extrabold leading-none">{t("mission.badge.value")}</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide">{t("mission.badge.label")}</p>
            </div>
          </div>
          <div className="max-w-xl space-y-4">
            <h2 className="text-2xl font-semibold sm:text-3xl">{t("mission.title")}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{t("mission.p1")}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{t("mission.p2")}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{t("mission.p3")}</p>
          </div>
        </div>
      </section>

      <section className="bg-background py-14 md:py-20">
        <div className="site-container space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">{t("values.title")}</h2>
            <p className="mt-2 text-muted-foreground">{t("values.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {valueItems.map((item, index) => {
              const Icon = valueIcons[index];
              return (
                <Card key={item} className="rounded-2xl bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                  <CardContent className="space-y-4 p-6">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-semibold">{t(`values.items.${item}.title`)}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{t(`values.items.${item}.description`)}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-muted/15 py-14 md:py-20">
        <div className="site-container">
          <div className="rounded-3xl bg-slate-950/95 p-6 text-slate-50 shadow-xl shadow-black/20 ring-1 ring-white/10 md:p-10 dark:bg-slate-900/70">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr]">
              <div>
                <h2 className="text-2xl font-bold sm:text-3xl">{t("numbers.title")}</h2>
                <div className="mt-6 grid grid-cols-2 gap-6">
                  {statItems.map((item) => (
                    <div key={item}>
                      <p className="text-4xl font-extrabold text-primary">{t(`numbers.stats.${item}.value`)}</p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-300">{t(`numbers.stats.${item}.label`)}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {achievementCards.map((item) => (
                  <Card key={item} className="rounded-2xl border-white/10 bg-white/5 text-slate-100">
                    <CardContent className="space-y-2 p-5">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                        <FaShieldAlt className="h-4 w-4" />
                      </span>
                      <p className="font-semibold">{t(`numbers.cards.${item}.title`)}</p>
                      <p className="text-xs text-slate-300">{t(`numbers.cards.${item}.description`)}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-14 md:py-20">
        <div className="site-container space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">{t("environment.title")}</h2>
            <p className="mt-2 text-muted-foreground">{t("environment.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:auto-rows-[220px] md:grid-cols-2">
            <div className="overflow-hidden rounded-2xl md:row-span-2">
              <Image
                src={t("environment.items.mentor.image")}
                alt={t("environment.items.mentor.alt")}
                width={1200}
                height={1400}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-2xl">
              <Image
                src={t("environment.items.classroom.image")}
                alt={t("environment.items.classroom.alt")}
                width={1000}
                height={700}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-2xl">
              <Image
                src={t("environment.items.faculty.image")}
                alt={t("environment.items.faculty.alt")}
                width={1000}
                height={700}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/10 py-14 md:py-20">
        <div className="site-container grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">
              {t("why.titleStart")} <span className="text-primary">{t("why.titleHighlight")}</span>
            </h2>
            <p className="mt-4 max-w-prose text-muted-foreground">{t("why.subtitle")}</p>
            <Card className="mt-5 w-fit rounded-xl bg-card/80 p-4">
              <p className="text-sm font-semibold text-primary">{t("why.promo.title")}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t("why.promo.subtitle")}</p>
            </Card>
          </div>
          <div className="space-y-4">
            {whyItems.map((item, index) => {
              const Icon = whyIcons[index];
              return (
                <Card key={item} className="rounded-xl bg-card shadow-sm">
                  <CardContent className="flex items-start gap-3 p-4">
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{t(`why.features.${item}.title`)}</p>
                      <p className="mt-1 text-xs leading-6 text-muted-foreground">{t(`why.features.${item}.description`)}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-background py-14 md:py-20">
        <div className="site-container text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            {t("journeyCta.titleStart")} <span className="text-primary">{t("journeyCta.titleHighlight")}</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{t("journeyCta.subtitle")}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild className="h-11 cursor-pointer">
              <Link href={`/${locale}/contact`}>
                {t("journeyCta.primary")} <FaArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 cursor-pointer">
              <Link href={`/${locale}/courses`}>{t("journeyCta.secondary")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-muted/15 py-14 md:py-20">
        <div className="site-container overflow-hidden rounded-3xl bg-card/80 shadow-xl shadow-black/10 ring-1 ring-border/20">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="bg-slate-950/95 p-6 text-slate-50 md:p-10 dark:bg-slate-900/75">
              <h3 className="max-w-sm text-3xl font-bold leading-tight">{t("journeyForm.title")}</h3>
              <p className="mt-4 max-w-prose text-sm text-slate-300">{t("journeyForm.subtitle")}</p>
              <ul className="mt-6 space-y-3">
                {journeyBenefits.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm font-medium">
                    <FaCheckCircle className="text-primary" />
                    {t(`journeyForm.benefits.${item}`)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 md:p-10">
              <LeadCaptureForm source="about" variant="compact" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
