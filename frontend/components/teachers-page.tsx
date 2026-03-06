"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  FaArrowRight,
  FaBookOpen,
  FaBullseye,
  FaCalendarAlt,
  FaCheckCircle,
  FaChalkboardTeacher,
  FaComments,
  FaFlask,
  FaGraduationCap,
  FaStar,
  FaUserCheck,
} from "react-icons/fa";
import { getPublicTeachers, getPublicTestimonials, pickLocalized, type LocaleCode, type PublicTeacher, type PublicTestimonial, resolveMediaUrl } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadCaptureForm } from "./lead-capture-form";

type TeacherView = {
  id: string;
  name: string;
  role: string;
  bio: string;
  experience: string;
  specialization: string;
  image: string;
};

type FeedbackView = {
  id: string;
  name: string;
  quote: string;
  descriptor: string;
  image: string;
};

const fallbackTeachers: TeacherView[] = [
  {
    id: "helena",
    name: "Dr. Helena Vance",
    role: "IELTS Specialist",
    bio: "Former examiner focused on high-band writing and speaking outcomes.",
    experience: "12+ years",
    specialization: "IELTS",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "marcus",
    name: "Marcus Sterling",
    role: "SAT Math Coach",
    bio: "Specialist in SAT strategy and high-score quantitative reasoning.",
    experience: "8+ years",
    specialization: "SAT",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "sarah",
    name: "Sarah Johnson",
    role: "Speaking & Writing Coach",
    bio: "Focused on speaking fluency and writing structure.",
    experience: "6+ years",
    specialization: "IELTS",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "daniel",
    name: "Daniel Carter",
    role: "IELTS General Specialist",
    bio: "Exam-oriented training for practical communication performance.",
    experience: "7+ years",
    specialization: "IELTS",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "elena",
    name: "Elena Petrov",
    role: "Grammar & Syntax Lead",
    bio: "Builds strong grammar foundations for exam confidence.",
    experience: "9+ years",
    specialization: "General English",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "sophia",
    name: "Sophia Martinez",
    role: "Fluency Workshop Lead",
    bio: "Improves speaking speed, clarity, and confidence.",
    experience: "5+ years",
    specialization: "General English",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
  },
];

const fallbackFeedback: FeedbackView[] = [
  {
    id: "james",
    name: "James Wilson",
    quote: "Focused mentor feedback accelerated my IELTS progress.",
    descriptor: "IELTS Candidate",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "ananya",
    name: "Ananya Roy",
    quote: "SAT strategy sessions improved my confidence and score.",
    descriptor: "SAT Candidate",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "ahmed",
    name: "Ahmed Al-Sayed",
    quote: "GMAT coaching helped me solve quant problems faster.",
    descriptor: "GMAT Candidate",
    image: "https://randomuser.me/api/portraits/men/74.jpg",
  },
];

const teachFeatures = ["feedback", "group", "adaptive", "quality"] as const;
const approachCards = ["quant", "verbal", "mock"] as const;
const consultBenefits = ["diagnostic", "roadmap"] as const;
const teachIcons = [FaComments, FaUserCheck, FaBookOpen, FaChalkboardTeacher];
const approachIcons = [FaGraduationCap, FaBullseye, FaFlask];

function mapTeacher(item: PublicTeacher, locale: LocaleCode): TeacherView {
  return {
    id: item.id,
    name: item.name,
    role: pickLocalized(locale, { en: item.roleEn, ru: item.roleRu, uz: item.roleUz }),
    bio: pickLocalized(locale, { en: item.bioEn, ru: item.bioRu, uz: item.bioUz }),
    experience: item.experience,
    specialization: item.specialization,
    image: resolveMediaUrl(item.imageUrl),
  };
}

function mapFeedback(item: PublicTestimonial, locale: LocaleCode): FeedbackView {
  return {
    id: item.id,
    name: item.name,
    quote: pickLocalized(locale, { en: item.quoteEn, ru: item.quoteRu, uz: item.quoteUz }),
    descriptor: pickLocalized(locale, { en: item.descriptorEn, ru: item.descriptorRu, uz: item.descriptorUz }),
    image: resolveMediaUrl(item.imageUrl) || "https://randomuser.me/api/portraits/men/74.jpg",
  };
}

export function TeachersPage() {
  const t = useTranslations("teachersPage");
  const tHero = useTranslations("teachers.hero");
  const locale = useLocale() as LocaleCode;

  const [teachers, setTeachers] = useState<TeacherView[]>(fallbackTeachers);
  const [feedback, setFeedback] = useState<FeedbackView[]>(fallbackFeedback);

  useEffect(() => {
    let active = true;

    void (async () => {
      const [teacherItems, testimonialItems] = await Promise.all([getPublicTeachers(), getPublicTestimonials()]);
      if (!active) return;

      if (teacherItems.length > 0) {
        setTeachers(teacherItems.map((item) => mapTeacher(item, locale)));
      }

      if (testimonialItems.length > 0) {
        setFeedback(testimonialItems.map((item) => mapFeedback(item, locale)).slice(0, 3));
      }
    })();

    return () => {
      active = false;
    };
  }, [locale]);

  const featuredTeachers = useMemo(() => teachers.slice(0, 2), [teachers]);
  const teamTeachers = useMemo(() => teachers.slice(2, 6), [teachers]);

  return (
    <main className="bg-background text-foreground">
      <section className="bg-background py-14 md:py-20">
        <div className="site-container space-y-4">
          <Badge className="w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary dark:border-primary/25 dark:bg-primary/15">
            {tHero("badge")}
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">{t("header.title")}</h1>
          <p className="max-w-prose text-muted-foreground">{t("header.subtitle")}</p>
        </div>
      </section>

      <section className="bg-muted/10 py-14 md:py-20">
        <div className="site-container space-y-6 md:space-y-8">
          {featuredTeachers.map((teacher, index) => (
            <Card key={teacher.id} className="overflow-hidden rounded-3xl bg-card/90 shadow-md ring-1 ring-border/40">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className={`relative aspect-[4/3] ${index === 1 ? "md:order-2" : ""}`}>
                  <Image src={teacher.image} alt={teacher.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="h-full w-full object-cover" />
                </div>
                <div className={`p-6 md:p-10 ${index === 1 ? "md:order-1" : ""}`}>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{teacher.role}</Badge>
                    <Badge variant="secondary">{teacher.specialization}</Badge>
                  </div>
                  <h2 className="mt-4 text-2xl font-bold">{teacher.name}</h2>
                  <p className="mt-2 text-sm font-semibold text-primary">{teacher.experience}</p>
                  <p className="mt-4 max-w-prose text-sm leading-7 text-muted-foreground">{teacher.bio}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button className="h-11 cursor-pointer">{t("featured.actions.book")}</Button>
                    <Button variant="outline" className="h-11 cursor-pointer">
                      {t("featured.actions.profile")} <FaArrowRight className="ml-2 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-background py-14 md:py-20">
        <div className="site-container space-y-8">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">{t("team.title")}</h2>
            <p className="mt-2 text-muted-foreground">{t("team.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {teamTeachers.map((teacher) => (
              <Card key={teacher.id} className="overflow-hidden rounded-2xl bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                <div className="relative aspect-[4/5]">
                  <Image src={teacher.image} alt={teacher.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw" className="h-full w-full object-cover" />
                </div>
                <CardContent className="space-y-1 p-5">
                  <p className="font-semibold">{teacher.name}</p>
                  <p className="text-sm font-medium text-primary">{teacher.role}</p>
                  <p className="text-xs text-muted-foreground">{teacher.experience}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/10 py-14 md:py-20">
        <div className="site-container space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">{t("how.title")}</h2>
            <p className="mt-2 text-muted-foreground">{t("how.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {teachFeatures.map((feature, index) => {
              const Icon = teachIcons[index];
              return (
                <Card key={feature} className="rounded-2xl bg-card text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                  <CardContent className="space-y-4 p-6">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold">{t(`how.items.${feature}.title`)}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{t(`how.items.${feature}.description`)}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-background py-14 md:py-20">
        <div className="site-container space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">{t("feedback.title")}</h2>
            <p className="mt-2 text-muted-foreground">{t("feedback.subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {feedback.map((item) => (
              <Card key={item.id} className="rounded-2xl bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                <CardContent className="space-y-5 p-6">
                  <div className="flex gap-1 text-primary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar key={`${item.id}-${i}`} className="h-4 w-4" />
                    ))}
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{item.quote}</p>
                  <div className="flex items-center gap-3">
                    <Image src={item.image} alt={item.name} width={40} height={40} sizes="40px" className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-semibold">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.descriptor}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/10 py-14 md:py-20">
        <div className="site-container text-center">
          <Card className="mx-auto max-w-3xl rounded-3xl bg-card/90 p-6 shadow-sm ring-1 ring-border/30 md:p-10">
            <CardTitle className="text-2xl sm:text-3xl">{t("cta.title")}</CardTitle>
            <p className="mx-auto mt-3 max-w-prose text-muted-foreground">{t("cta.subtitle")}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild className="h-11 cursor-pointer">
                <Link href={`/${locale}/contact`}>{t("cta.primary")}</Link>
              </Button>
              <Button asChild variant="outline" className="h-11 cursor-pointer">
                <Link href={`/${locale}/courses`}>{t("cta.secondary")}</Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <section className="bg-muted/15 py-14 md:py-20">
        <div className="site-container rounded-3xl bg-card/60 p-6 shadow-xl shadow-black/20 ring-1 ring-border/20 backdrop-blur md:p-10 dark:ring-white/10">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-2xl font-bold sm:text-3xl">{t("approach.title")}</h2>
            <p className="text-muted-foreground">{t("approach.subtitle")}</p>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {approachCards.map((item, index) => {
              const Icon = approachIcons[index];
              return (
                <Card key={item} className="rounded-2xl bg-card/50 shadow-lg ring-1 ring-border/20 dark:bg-card/40 dark:ring-white/10">
                  <CardContent className="space-y-4 p-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="space-y-2">
                      <p className="text-lg font-semibold">{t(`approach.cards.${item}.title`)}</p>
                      <p className="text-sm leading-6 text-muted-foreground">{t(`approach.cards.${item}.description`)}</p>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex gap-2">
                        <FaCheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                        {t(`approach.cards.${item}.points.0`)}
                      </li>
                      <li className="flex gap-2">
                        <FaCheckCircle className="mt-0.5 h-4 w-4 text-primary" />
                        {t(`approach.cards.${item}.points.1`)}
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-muted/10 py-14 md:py-20">
        <div className="site-container overflow-hidden rounded-3xl bg-card/80 shadow-xl shadow-black/10 ring-1 ring-border/20">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-6 md:p-10">
              <h3 className="text-3xl font-bold leading-tight">
                {t("consult.titleStart")} <span className="text-primary">{t("consult.titleHighlight")}</span>
              </h3>
              <p className="mt-4 max-w-prose text-muted-foreground">{t("consult.subtitle")}</p>
              <ul className="mt-6 space-y-4">
                {consultBenefits.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-0.5 text-primary">
                      <FaCalendarAlt className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{t(`consult.benefits.${item}.title`)}</p>
                      <p className="text-xs text-muted-foreground">{t(`consult.benefits.${item}.description`)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 md:p-10">
              <LeadCaptureForm source="teachers" variant="compact" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


