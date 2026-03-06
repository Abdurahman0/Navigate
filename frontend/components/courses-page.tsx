"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaChartLine,
  FaClock,
  FaCommentDots,
  FaMicrophone,
  FaSignal,
  FaUsers,
} from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import { getPublicCourses, type LocaleCode, type PublicCourse, pickLocalized } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadCaptureForm } from "./lead-capture-form";

type Category = "all" | "ielts" | "sat" | "gmat" | "general";
type Group = "english" | "exam";

type CourseView = {
  id: string;
  category: Exclude<Category, "all">;
  group: Group;
  title: string;
  description: string;
  duration: string;
  level: string;
  schedule: string;
  price: string;
  premium: boolean;
  status: string;
};

const fallbackCourses: CourseView[] = [
  {
    id: "ielts-academic",
    category: "ielts",
    group: "english",
    title: "IELTS Academic Mastery",
    description: "Comprehensive IELTS preparation focused on high-band success.",
    duration: "12 Weeks",
    level: "Intermediate",
    schedule: "Mon, Wed, Fri (18:00 - 20:00)",
    price: "$299.00",
    premium: false,
    status: "Enrollment Open",
  },
  {
    id: "general-english",
    category: "general",
    group: "english",
    title: "Foundations of Fluency",
    description: "Build speaking and grammar confidence for daily communication.",
    duration: "16 Weeks",
    level: "Beginner to Intermediate",
    schedule: "Tue, Thu, Sat (10:00 - 12:00)",
    price: "$180.00",
    premium: false,
    status: "Enrollment Open",
  },
  {
    id: "skills-focus",
    category: "general",
    group: "english",
    title: "Native-Level Speaking",
    description: "Intensive speaking track with personalized pronunciation coaching.",
    duration: "8 Weeks",
    level: "Intermediate+",
    schedule: "Saturdays (14:00 - 18:00)",
    price: "$150.00",
    premium: false,
    status: "Enrollment Open",
  },
  {
    id: "sat-elite",
    category: "sat",
    group: "exam",
    title: "SAT Elite: Path to IVY League",
    description: "Advanced SAT strategy with full-length digital mocks and analytics.",
    duration: "14 Weeks",
    level: "Advanced",
    schedule: "Tue, Thu (16:00 - 19:00)",
    price: "$850.00",
    premium: true,
    status: "Enrollment Open",
  },
  {
    id: "gmat-executive",
    category: "gmat",
    group: "exam",
    title: "GMAT Executive Preparation",
    description: "Quant + verbal intensive program for top-tier MBA admissions.",
    duration: "12 Weeks",
    level: "Graduate",
    schedule: "Mon, Wed (19:00 - 21:30)",
    price: "$1,200.00",
    premium: true,
    status: "Enrollment Open",
  },
];

const filterOrder: Category[] = ["all", "ielts", "sat", "gmat", "general"];
const successKeys = ["arjun", "liwei", "sarah"] as const;
const featureKeys = ["smallGroups", "mockExams", "feedback", "speaking", "tracking"] as const;
const leadBenefits = ["diagnostic", "guidance", "plan"] as const;
const featureIcons = [FaUsers, FaCalendarAlt, FaCommentDots, FaMicrophone, FaChartLine];

function categoryFromBackend(value: string): Exclude<Category, "all"> {
  const normalized = value.toLowerCase();
  if (normalized.includes("ielts")) return "ielts";
  if (normalized.includes("sat")) return "sat";
  if (normalized.includes("gmat")) return "gmat";
  return "general";
}

function groupFromCategory(category: Exclude<Category, "all">): Group {
  return category === "sat" || category === "gmat" ? "exam" : "english";
}

function toCourseView(item: PublicCourse, locale: LocaleCode): CourseView {
  const category = categoryFromBackend(item.category);
  return {
    id: item.id,
    category,
    group: groupFromCategory(category),
    title: pickLocalized(locale, {
      en: item.titleEn,
      ru: item.titleRu,
      uz: item.titleUz,
    }),
    description: pickLocalized(locale, {
      en: item.descriptionEn,
      ru: item.descriptionRu,
      uz: item.descriptionUz,
    }),
    duration: item.duration,
    level: item.level,
    schedule: item.schedule,
    price: item.price,
    premium: category === "sat" || category === "gmat",
    status: item.status,
  };
}

export function CoursesPage() {
  const t = useTranslations("coursesPage");
  const locale = useLocale() as LocaleCode;
  const [activeFilter, setActiveFilter] = useState<Category>("all");
  const [courses, setCourses] = useState<CourseView[]>(fallbackCourses);

  useEffect(() => {
    let active = true;

    void (async () => {
      const apiCourses = await getPublicCourses();
      if (!active || apiCourses.length === 0) return;
      setCourses(apiCourses.map((item) => toCourseView(item, locale)));
    })();

    return () => {
      active = false;
    };
  }, [locale]);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return courses;
    return courses.filter((course) => course.category === activeFilter);
  }, [activeFilter, courses]);

  const englishPrograms = filtered.filter((course) => course.group === "english");
  const examPrograms = filtered.filter((course) => course.group === "exam");

  return (
    <main className="bg-background text-foreground">
      <section className="bg-background py-14 md:py-20">
        <div className="site-container space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">{t("header.title")}</h1>
            <p className="max-w-prose text-muted-foreground">{t("header.subtitle")}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {filterOrder.map((filter) => (
              <Button
                key={filter}
                type="button"
                variant={activeFilter === filter ? "default" : "outline"}
                className="h-10"
                onClick={() => setActiveFilter(filter)}
              >
                {t(`filters.${filter}`)}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {englishPrograms.length > 0 ? (
        <section className="bg-muted/10 py-14 md:py-20">
          <div className="site-container space-y-8">
            <h2 className="text-2xl font-bold sm:text-3xl">{t("english.title")}</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {englishPrograms.map((course) => (
                <Card key={course.id} className="bg-card">
                  <CardHeader className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="secondary">{course.category.toUpperCase()}</Badge>
                      <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-500">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        {course.status || t("labels.open")}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <FaCalendarAlt className="text-primary" />
                        {course.duration}
                      </li>
                      <li className="flex items-center gap-2">
                        <FaSignal className="text-primary" />
                        {course.level}
                      </li>
                      <li className="flex items-center gap-2">
                        <FaClock className="text-primary" />
                        {course.schedule}
                      </li>
                    </ul>
                    <p className="text-3xl font-extrabold text-primary">{course.price}</p>
                    <Button className="w-full">{t("buttons.enroll")}</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {examPrograms.length > 0 ? (
        <section className="bg-background py-14 md:py-20">
          <div className="site-container space-y-8">
            <h2 className="text-2xl font-bold sm:text-3xl">{t("exam.title")}</h2>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              {examPrograms.map((course) => (
                <Card key={course.id} className="bg-card">
                  <CardHeader className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="secondary">{course.category.toUpperCase()}</Badge>
                      {course.premium ? <Badge>{t("labels.premium")}</Badge> : null}
                    </div>
                    <CardTitle className="text-2xl">{course.title}</CardTitle>
                    <p className="max-w-prose text-sm text-muted-foreground">{course.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid grid-cols-1 gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                      <p className="flex items-center gap-2">
                        <FaClock className="text-primary" />
                        {course.duration}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaSignal className="text-primary" />
                        {course.level}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaCalendarAlt className="text-primary" />
                        {course.schedule}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaUsers className="text-primary" />
                        {t(`courses.satElite.groupSize`)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <p className="text-3xl font-extrabold">{course.price}</p>
                      <Button className="min-w-36">{t("buttons.enroll")}</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-muted/10 py-10 md:py-14">
        <div className="site-container grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {featureKeys.map((key, index) => {
            const Icon = featureIcons[index];
            return (
              <div key={key} className="flex flex-col items-center gap-3 text-center">
                <span className="rounded-lg bg-card p-3 text-primary shadow-sm">
                  <Icon className="h-4 w-4" />
                </span>
                <p className="text-sm font-semibold">{t(`featureRow.${key}`)}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-muted/15 py-14 md:py-20">
        <div className="site-container rounded-3xl bg-card/60 p-6 shadow-xl shadow-black/20 ring-1 ring-border/20 backdrop-blur md:p-10 dark:ring-white/5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{t("success.title")}</h2>
              <p className="mt-2 max-w-prose text-muted-foreground">{t("success.subtitle")}</p>
            </div>
            <Button asChild variant="ghost">
              <Link href={`/${locale}/results`}>
                {t("success.link")} <FaArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {successKeys.map((key) => (
              <Card key={key} className="bg-card/70">
                <CardContent className="p-5">
                  <p className="font-semibold">{t(`success.cards.${key}.name`)}</p>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{t(`success.cards.${key}.program`)}</p>
                  <p className="mt-2 text-lg font-bold text-primary">{t(`success.cards.${key}.result`)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-14 md:py-20">
        <div className="site-container">
          <Card className="mx-auto max-w-3xl bg-card p-6 text-center md:p-10">
            <CardTitle className="text-2xl sm:text-3xl">{t("cta.title")}</CardTitle>
            <p className="mx-auto mt-3 max-w-prose text-muted-foreground">{t("cta.subtitle")}</p>
            <Button asChild className="mt-6">
              <Link href={`/${locale}/contact`}>{t("cta.button")}</Link>
            </Button>
          </Card>
        </div>
      </section>

      <section className="bg-muted/20 py-14 md:py-20">
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
            <LeadCaptureForm source="courses" variant="compact" />
          </div>
        </div>
      </section>
    </main>
  );
}

