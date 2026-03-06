export type LocaleCode = "en" | "ru" | "uz";

export type PublicCourse = {
  id: string;
  slug: string;
  category: string;
  titleEn: string;
  titleRu: string;
  titleUz: string;
  descriptionEn: string;
  descriptionRu: string;
  descriptionUz: string;
  duration: string;
  level: string;
  schedule: string;
  price: string;
  status: string;
  imageUrl: string | null;
  isPublished: boolean;
};

export type PublicTeacher = {
  id: string;
  name: string;
  roleEn: string;
  roleRu: string;
  roleUz: string;
  bioEn: string;
  bioRu: string;
  bioUz: string;
  imageUrl: string;
  experience: string;
  specialization: string;
  isPublished: boolean;
};

export type PublicResult = {
  id: string;
  studentName: string;
  examType: string;
  beforeScore: string;
  afterScore: string;
  quoteEn: string;
  quoteRu: string;
  quoteUz: string;
  imageUrl: string | null;
  isPublished: boolean;
};

export type PublicTestimonial = {
  id: string;
  name: string;
  quoteEn: string;
  quoteRu: string;
  quoteUz: string;
  descriptorEn: string;
  descriptorRu: string;
  descriptorUz: string;
  imageUrl: string | null;
  isPublished: boolean;
};

export type PublicSiteSettings = {
  id: string;
  phone: string;
  email: string;
  telegram: string;
  whatsapp: string;
  brochureUrl: string;
  addressEn: string;
  addressRu: string;
  addressUz: string;
  workingHoursEn: string;
  workingHoursRu: string;
  workingHoursUz: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export function resolveMediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return `${API_URL}${path}`;
  return `${API_URL}/${path}`;
}

async function safeFetch<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export function pickLocalized(
  locale: LocaleCode,
  values: { en: string; ru: string; uz: string },
): string {
  if (locale === "ru") return values.ru;
  if (locale === "uz") return values.uz;
  return values.en;
}

export async function getPublicCourses(): Promise<PublicCourse[]> {
  const data = await safeFetch<{ ok: true; items: PublicCourse[] }>("/api/public/courses");
  return data?.items ?? [];
}

export async function getPublicTeachers(): Promise<PublicTeacher[]> {
  const data = await safeFetch<{ ok: true; items: PublicTeacher[] }>("/api/public/teachers");
  return data?.items ?? [];
}

export async function getPublicResults(): Promise<PublicResult[]> {
  const data = await safeFetch<{ ok: true; items: PublicResult[] }>("/api/public/results");
  return data?.items ?? [];
}

export async function getPublicTestimonials(): Promise<PublicTestimonial[]> {
  const data = await safeFetch<{ ok: true; items: PublicTestimonial[] }>("/api/public/testimonials");
  return data?.items ?? [];
}

export async function getPublicSettings(): Promise<PublicSiteSettings | null> {
  const data = await safeFetch<{ ok: true; item: PublicSiteSettings | null }>("/api/public/settings");
  return data?.item ?? null;
}

