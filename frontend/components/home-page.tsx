"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  FiArrowRight,
  FiAward,
  FiCheckCircle,
  FiClock,
  FiMessageSquare,
  FiStar,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { LiaCertificateSolid } from "react-icons/lia";
import { TbTargetArrow } from "react-icons/tb";
import {
  getPublicCourses,
  getPublicResults,
  getPublicTeachers,
  getPublicTestimonials,
  pickLocalized,
  resolveMediaUrl,
  type LocaleCode,
  type PublicCourse,
  type PublicResult,
  type PublicTeacher,
  type PublicTestimonial,
} from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "next-intl";
import { LeadCaptureForm } from "./lead-capture-form";

const statIcons = [FiUsers, TbTargetArrow, LiaCertificateSolid, FiClock];
const programIcons = [HiOutlineAcademicCap, FiAward, TbTargetArrow, FiUsers];
const methodIcons = [FiTrendingUp, FiAward, FiClock, FiMessageSquare];

type ProgramView = {
  id: string;
  badge: string;
  title: string;
  duration: string;
  target: string;
  price: string;
};

type ResultView = {
  id: string;
  name: string;
  exam: string;
  before: string;
  after: string;
};

type FacultyView = {
  id: string;
  name: string;
  role: string;
  meta: string;
  image: string;
};

type TestimonialView = {
  id: string;
  quote: string;
  name: string;
  meta: string;
  image: string;
};

const fallbackPrograms: ProgramView[] = [
  { id: "p1", badge: "IELTS", title: "IELTS Academic Mastery", duration: "12 Weeks", target: "Band 7+", price: "$349" },
  { id: "p2", badge: "SAT", title: "SAT College Board Prep", duration: "10 Weeks", target: "1500+", price: "$499" },
  { id: "p3", badge: "GMAT", title: "GMAT MBA Focus Track", duration: "14 Weeks", target: "700+", price: "$599" },
  { id: "p4", badge: "General", title: "General English Fluency", duration: "Monthly Flex", target: "A1-C2", price: "$199" },
];

const fallbackResults: ResultView[] = [
  { id: "r1", name: "Arjun Mehta", exam: "IELTS Academic", before: "5.5", after: "7.5" },
  { id: "r2", name: "Daniel Kim", exam: "SAT Prep", before: "1280", after: "1540" },
  { id: "r3", name: "Sofia Rodriguez", exam: "GMAT Intensive", before: "610", after: "720" },
];

const fallbackFaculty: FacultyView[] = [
  {
    id: "f1",
    name: "Dr. Helena Vance",
    role: "IELTS Specialist",
    meta: "12+ Years Experience",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "f2",
    name: "Marcus Sterling",
    role: "SAT Coach",
    meta: "8+ Years Experience",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "f3",
    name: "Emily Ross",
    role: "GMAT Coach",
    meta: "10+ Years Experience",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=900&q=80",
  },
];

const fallbackTestimonials: TestimonialView[] = [
  {
    id: "t1",
    quote: "The feedback system improved my score in just weeks.",
    name: "James Wilson",
    meta: "IELTS Candidate",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "t2",
    quote: "The mock tests were exactly like the real exam.",
    name: "Ananya Roy",
    meta: "SAT Candidate",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "t3",
    quote: "They taught exam logic, not just grammar.",
    name: "Ahmed Al-Sayed",
    meta: "GMAT Candidate",
    image: "https://randomuser.me/api/portraits/men/74.jpg",
  },
];

function mapProgram(item: PublicCourse, locale: LocaleCode): ProgramView {
  const badge = item.category.toUpperCase();
  return {
    id: item.id,
    badge,
    title: pickLocalized(locale, {
      en: item.titleEn,
      ru: item.titleRu,
      uz: item.titleUz,
    }),
    duration: item.duration,
    target: item.level,
    price: item.price,
  };
}

function mapResult(item: PublicResult): ResultView {
  return {
    id: item.id,
    name: item.studentName,
    exam: item.examType,
    before: item.beforeScore,
    after: item.afterScore,
  };
}

function mapFaculty(item: PublicTeacher, locale: LocaleCode): FacultyView {
  return {
    id: item.id,
    name: item.name,
    role: pickLocalized(locale, { en: item.roleEn, ru: item.roleRu, uz: item.roleUz }),
    meta: `${item.experience} • ${item.specialization}`,
    image: resolveMediaUrl(item.imageUrl),
  };
}

function mapTestimonial(item: PublicTestimonial, locale: LocaleCode): TestimonialView {
  return {
    id: item.id,
    quote: pickLocalized(locale, { en: item.quoteEn, ru: item.quoteRu, uz: item.quoteUz }),
    name: item.name,
    meta: pickLocalized(locale, {
      en: item.descriptorEn,
      ru: item.descriptorRu,
      uz: item.descriptorUz,
    }),
    image: resolveMediaUrl(item.imageUrl) || "https://randomuser.me/api/portraits/men/32.jpg",
  };
}

export function HomePage() {
  const t = useTranslations("home");
  const locale = useLocale() as LocaleCode;

  const [programs, setPrograms] = useState<ProgramView[]>(fallbackPrograms);
  const [results, setResults] = useState<ResultView[]>(fallbackResults);
  const [faculty, setFaculty] = useState<FacultyView[]>(fallbackFaculty);
  const [testimonials, setTestimonials] = useState<TestimonialView[]>(fallbackTestimonials);

  const stats = ["students", "scores", "coaches", "plans"] as const;
  const benefits = ["diagnostic", "guidance", "plan"] as const;
  const methods = ["diagnostic", "curriculum", "simulation", "feedback"] as const;

  useEffect(() => {
    let active = true;

    void (async () => {
      const [courseItems, resultItems, teacherItems, testimonialItems] = await Promise.all([
        getPublicCourses(),
        getPublicResults(),
        getPublicTeachers(),
        getPublicTestimonials(),
      ]);

      if (!active) return;

      if (courseItems.length > 0) {
        setPrograms(courseItems.slice(0, 4).map((item) => mapProgram(item, locale)));
      }

      if (resultItems.length > 0) {
        setResults(resultItems.slice(0, 3).map(mapResult));
      }

      if (teacherItems.length > 0) {
        setFaculty(teacherItems.slice(0, 3).map((item) => mapFaculty(item, locale)));
      }

      if (testimonialItems.length > 0) {
        setTestimonials(testimonialItems.slice(0, 3).map((item) => mapTestimonial(item, locale)));
      }
    })();

    return () => {
      active = false;
    };
  }, [locale]);

  const paddedPrograms = useMemo(() => {
    if (programs.length >= 4) return programs.slice(0, 4);
    return [...programs, ...fallbackPrograms].slice(0, 4);
  }, [programs]);

  return (
    <main className="bg-background text-foreground">
      <section className="bg-background py-14 md:py-20">
        <div className="site-container space-y-8">
          <Badge>{t("hero.badge")}</Badge>
          <h1 className="max-w-4xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {t("hero.titleStart")} <span className="text-primary">{t("hero.titleHighlight")}</span> {t("hero.titleEnd")}
          </h1>
          <p className="max-w-prose text-base text-muted-foreground sm:text-lg">{t("hero.subtitle")}</p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg">
              {t("hero.primaryButton")} <FiArrowRight className="ml-2" />
            </Button>
            <Button size="lg" variant="outline">
              {t("hero.secondaryButton")}
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-muted/10 py-14 md:py-20">
        <div className="site-container grid grid-cols-1 gap-6 sm:grid-cols-1 md:gap-8 lg:grid-cols-4">
          {stats.map((item, index) => {
            const Icon = statIcons[index];
            return (
              <Card key={item} className="bg-card">
                <CardContent className="flex items-center gap-4 p-5">
                  <span className="rounded-full bg-primary/10 p-2 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xl font-bold">{t(`stats.${item}.value`)}</p>
                    <p className="text-sm text-muted-foreground">{t(`stats.${item}.label`)}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="bg-background py-14 md:py-20">
        <div className="site-container space-y-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">{t("programs.title")}</h2>
              <p className="mt-2 max-w-prose text-muted-foreground">{t("programs.subtitle")}</p>
            </div>
            <Button variant="ghost">{t("programs.explore")}</Button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {paddedPrograms.map((program, index) => {
              const Icon = programIcons[index] || FiAward;
              return (
                <Card key={program.id} className="group bg-card hover:-translate-y-1">
                  <CardHeader className="space-y-4">
                    <Badge variant="secondary">{program.badge}</Badge>
                    <CardTitle className="text-xl">{program.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-sm">
                      <Icon className="text-primary" />
                      {program.duration}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">{program.target}</p>
                    <p className="text-2xl font-extrabold text-primary">{program.price}</p>
                    <Button className="mt-3 w-full">{t("programs.enroll")}</Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-muted/15 py-14 md:py-20">
        <div className="site-container rounded-3xl bg-card/60 p-6 shadow-xl shadow-black/20 ring-1 ring-border/20 backdrop-blur md:p-10 dark:ring-white/5">
          <div className="text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">{t("results.title")}</h2>
            <p className="mx-auto mt-2 max-w-prose text-muted-foreground">{t("results.subtitle")}</p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {results.map((item) => (
              <Card key={item.id} className="bg-card/70 text-card-foreground dark:bg-card/60">
                <CardContent className="p-5">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.exam}</p>
                  <p className="mt-2 text-lg font-bold">
                    {item.before} <span className="text-primary">&rarr;</span> {item.after}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/20 py-14 md:py-20">
        <div className="site-container space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">{t("method.title")}</h2>
            <p className="mx-auto mt-2 max-w-prose text-muted-foreground">{t("method.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {methods.map((feature, index) => {
              const Icon = methodIcons[index];
              return (
                <Card key={feature} className="cursor-pointer bg-card text-center hover:-translate-y-1">
                  <CardContent className="space-y-4 p-6">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="space-y-2">
                      <p className="text-lg font-semibold">{t(`method.features.${feature}.title`)}</p>
                      <p className="text-sm text-muted-foreground">{t(`method.features.${feature}.description`)}</p>
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
            <h2 className="text-2xl font-bold sm:text-3xl">{t("faculty.title")}</h2>
            <p className="mx-auto mt-2 max-w-prose text-muted-foreground">{t("faculty.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {faculty.map((member) => (
              <Card key={member.id} className="overflow-hidden bg-card hover:-translate-y-1">
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={900}
                    height={675}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="h-auto w-full object-cover grayscale transition duration-300 hover:scale-105 hover:grayscale-0"
                  />
                </div>
                <CardContent className="space-y-1 p-5">
                  <p className="text-lg font-semibold">{member.name}</p>
                  <p className="text-sm font-medium text-primary">{member.role}</p>
                  <p className="text-xs text-muted-foreground">{member.meta}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/15 py-14 md:py-20">
        <div className="site-container space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">{t("testimonials.title")}</h2>
            <p className="mx-auto mt-2 max-w-prose text-muted-foreground">{t("testimonials.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {testimonials.map((item) => (
              <Card key={item.id} className="relative overflow-hidden bg-card hover:-translate-y-1">
                <CardContent className="space-y-5 p-6">
                  <span className="absolute right-4 top-3 text-5xl font-black leading-none text-primary/20">&ldquo;</span>
                  <div className="flex gap-1 text-primary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar key={`${item.id}-${i}`} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{item.quote}</p>
                  <div className="flex items-center gap-3">
                    <Image src={item.image} alt={item.name} width={40} height={40} sizes="40px" className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-semibold">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.meta}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/20 py-14 md:py-20">
        <div className="site-container grid grid-cols-1 gap-0 overflow-hidden rounded-3xl bg-card/60 shadow-xl shadow-black/20 ring-1 ring-border/20 backdrop-blur lg:grid-cols-2 dark:ring-white/10">
          <div className="p-6 md:p-10">
            <h3 className="max-w-xs text-4xl font-bold leading-tight">{t("lead.title")}</h3>
            <p className="mt-5 text-muted-foreground">{t("lead.subtitle")}</p>
            <ul className="mt-6 space-y-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2 text-sm font-medium">
                  <FiCheckCircle className="text-primary" />
                  {t(`lead.benefits.${benefit}`)}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6 md:p-10">
            <LeadCaptureForm source="home" variant="compact" submitLabel={t("leadForm.submit")} />
          </div>
        </div>
      </section>
    </main>
  );
}


