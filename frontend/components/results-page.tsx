"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FiCheckCircle, FiStar } from "react-icons/fi";
import { getPublicResults, getPublicTestimonials, pickLocalized, type LocaleCode, type PublicResult, type PublicTestimonial, resolveMediaUrl } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LeadCaptureForm } from "./lead-capture-form";

type ResultView = {
  id: string;
  name: string;
  category: string;
  before: string;
  after: string;
  quote: string;
  image: string;
};

type TestimonialView = {
  id: string;
  name: string;
  quote: string;
  descriptor: string;
  image: string;
};

const fallbackResults: ResultView[] = [
  {
    id: "arjun",
    name: "Arjun Mehta",
    category: "IELTS Academic",
    before: "5.5",
    after: "7.0",
    quote: "The personalized feedback on writing tasks made all the difference.",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    id: "sophia",
    name: "Sophia Chen",
    category: "SAT Prep",
    before: "1180",
    after: "1450",
    quote: "The SAT strategy sessions were practical and highly effective.",
    image: "https://randomuser.me/api/portraits/women/22.jpg",
  },
  {
    id: "ahmed",
    name: "Ahmed Al-Sayed",
    category: "GMAT Focus",
    before: "520",
    after: "680",
    quote: "Complex verbal reasoning became clear after focused coaching.",
    image: "https://randomuser.me/api/portraits/men/33.jpg",
  },
];

const fallbackTestimonials: TestimonialView[] = [
  {
    id: "james",
    name: "James Wilson",
    quote: "The diagnostic entry test showed exactly what I needed to improve.",
    descriptor: "IELTS Candidate",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "ananya",
    name: "Ananya Roy",
    quote: "I improved my SAT score by 270 points in one term.",
    descriptor: "SAT Candidate",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "ahmed-testimonial",
    name: "Ahmed Al-Sayed",
    quote: "Instructors taught real exam logic, not just theory.",
    descriptor: "GMAT Candidate",
    image: "https://randomuser.me/api/portraits/men/74.jpg",
  },
];

const leadBenefits = ["diagnostic", "plan", "materials"] as const;

function mapResult(item: PublicResult, locale: LocaleCode): ResultView {
  return {
    id: item.id,
    name: item.studentName,
    category: item.examType,
    before: item.beforeScore,
    after: item.afterScore,
    quote: pickLocalized(locale, {
      en: item.quoteEn,
      ru: item.quoteRu,
      uz: item.quoteUz,
    }),
    image: resolveMediaUrl(item.imageUrl) || "https://randomuser.me/api/portraits/men/11.jpg",
  };
}

function mapTestimonial(item: PublicTestimonial, locale: LocaleCode): TestimonialView {
  return {
    id: item.id,
    name: item.name,
    quote: pickLocalized(locale, {
      en: item.quoteEn,
      ru: item.quoteRu,
      uz: item.quoteUz,
    }),
    descriptor: pickLocalized(locale, {
      en: item.descriptorEn,
      ru: item.descriptorRu,
      uz: item.descriptorUz,
    }),
    image: resolveMediaUrl(item.imageUrl) || "https://randomuser.me/api/portraits/women/44.jpg",
  };
}

export function ResultsPage() {
  const t = useTranslations("resultsPage");
  const tHero = useTranslations("results.hero");
  const locale = useLocale() as LocaleCode;

  const [results, setResults] = useState<ResultView[]>(fallbackResults);
  const [testimonials, setTestimonials] = useState<TestimonialView[]>(fallbackTestimonials);

  useEffect(() => {
    let active = true;

    void (async () => {
      const [apiResults, apiTestimonials] = await Promise.all([getPublicResults(), getPublicTestimonials()]);

      if (!active) return;

      if (apiResults.length > 0) {
        setResults(apiResults.map((item) => mapResult(item, locale)).slice(0, 6));
      }

      if (apiTestimonials.length > 0) {
        setTestimonials(apiTestimonials.map((item) => mapTestimonial(item, locale)).slice(0, 3));
      }
    })();

    return () => {
      active = false;
    };
  }, [locale]);

  return (
    <main className="bg-background text-foreground">
      <section className="relative overflow-hidden bg-background py-14 md:py-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="site-container relative space-y-5">
          <Badge className="w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary dark:border-primary/25 dark:bg-primary/15">
            {tHero("badge")}
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            {tHero("titlePrefix")} <span className="text-primary">{tHero("titleHighlight")}</span>
          </h1>
          <p className="max-w-prose text-base leading-7 text-muted-foreground">{tHero("subtitle")}</p>
        </div>
      </section>

      <section className="bg-muted/15 py-16 md:py-24">
        <div className="site-container flex justify-center">
          <div className="w-full max-w-6xl rounded-3xl bg-card/70 p-6 shadow-xl shadow-black/20 ring-1 ring-border/20 backdrop-blur md:p-10 dark:ring-white/5">
            <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3 md:divide-x md:divide-border/20">
              <div className="space-y-2">
                <p className="text-4xl font-extrabold text-primary">{t("stats.ielts.value")}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("stats.ielts.label")}</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-extrabold text-primary">{t("stats.sat.value")}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("stats.sat.label")}</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-extrabold text-primary">{t("stats.gmat.value")}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("stats.gmat.label")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/10 py-16 md:py-24">
        <div className="site-container">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((item) => (
              <Card key={item.id} className="bg-card/95 hover:-translate-y-1">
                <CardHeader className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Image src={item.image} alt={item.name} width={36} height={36} sizes="36px" className="h-9 w-9 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">{item.category}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-xl bg-muted/40 p-4 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("cards.scoreImprovementLabel")}</p>
                    <p className="mt-2 text-3xl font-extrabold">
                      {item.before} <span className="text-primary">&rarr;</span> {item.after}
                    </p>
                  </div>
                  <p className="text-sm italic leading-6 text-muted-foreground">{item.quote}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="site-container space-y-8">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">{t("voices.title")}</h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {testimonials.map((item) => (
              <Card key={item.id} className="relative bg-card hover:-translate-y-1">
                <CardContent className="space-y-5 p-6">
                  <span className="absolute right-5 top-3 text-5xl font-black leading-none text-primary/15">&ldquo;</span>
                  <div className="flex gap-1 text-primary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar key={`${item.id}-${i}`} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{item.quote}</p>
                  <div className="flex items-center gap-3">
                    <Image src={item.image} alt={item.name} width={36} height={36} sizes="36px" className="h-9 w-9 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.descriptor}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/20 py-16 md:py-24">
        <div className="site-container grid grid-cols-1 gap-0 overflow-hidden rounded-3xl bg-card/60 shadow-xl shadow-black/20 ring-1 ring-border/20 backdrop-blur lg:grid-cols-2 dark:ring-white/10">
          <div className="p-6 md:p-10">
            <h3 className="max-w-xs text-4xl font-bold leading-tight">{t("lead.title")}</h3>
            <p className="mt-5 max-w-prose text-muted-foreground">{t("lead.subtitle")}</p>
            <ul className="mt-6 space-y-3">
              {leadBenefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2 text-sm font-medium">
                  <FiCheckCircle className="text-primary" />
                  {t(`lead.benefits.${benefit}`)}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6 md:p-10">
            <LeadCaptureForm source="results" variant="compact" />
          </div>
        </div>
      </section>
    </main>
  );
}


