import { LeadStatus, Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { prisma } from "../lib/prisma";

type LocalizedText = {
  en: string;
  ru: string;
  uz: string;
};

type Collection = "courses" | "teachers" | "results" | "testimonials";

type LeadStatusText = "New" | "Contacted" | "Enrolled" | "Rejected";

function toIso(value: Date) {
  return value.toISOString();
}

function mapLeadStatus(status: LeadStatusText): LeadStatus {
  return status as LeadStatus;
}

function mapLead(item: {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  fullName: string;
  phoneNumber: string;
  examInterest: string;
  preferredTime: string | null;
  message: string | null;
  currentLevel: string | null;
  email: string | null;
  source: string;
  locale: string;
  pagePath: string;
  status: LeadStatus;
}) {
  return {
    id: item.id,
    createdAt: toIso(item.createdAt),
    updatedAt: toIso(item.updatedAt),
    fullName: item.fullName,
    phoneNumber: item.phoneNumber,
    examInterest: item.examInterest,
    preferredTime: item.preferredTime,
    message: item.message,
    currentLevel: item.currentLevel,
    email: item.email,
    source: item.source,
    locale: item.locale,
    pagePath: item.pagePath,
    status: item.status as LeadStatusText,
  };
}

function localizedFromRow(en: string, ru: string, uz: string): LocalizedText {
  return { en, ru, uz };
}

function ensureLocalized(input?: Partial<LocalizedText>): LocalizedText {
  return {
    en: input?.en?.trim() ?? "",
    ru: input?.ru?.trim() ?? "",
    uz: input?.uz?.trim() ?? "",
  };
}

function ensureNonEmpty(value: string, fallback: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function uniqueCourseSlug(base: string, excludeId?: string) {
  const normalizedBase = base.length > 0 ? base : randomUUID().slice(0, 8);
  let candidate = normalizedBase;
  let i = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.course.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    i += 1;
    candidate = `${normalizedBase}-${i}`;
  }
}

export async function addLead(lead: {
  fullName: string;
  phoneNumber: string;
  examInterest: "IELTS" | "SAT" | "GMAT" | "GeneralEnglish";
  preferredTime: string | null;
  message: string | null;
  currentLevel: string | null;
  email: string | null;
  source: "home" | "courses" | "results" | "teachers" | "about" | "contact";
  locale: "en" | "ru" | "uz";
  pagePath: string;
}) {
  const created = await prisma.lead.create({
    data: {
      ...lead,
      status: LeadStatus.New,
    },
  });

  return mapLead(created);
}

export async function listLeads(params: { page: number; limit: number; status?: LeadStatusText; search?: string }) {
  const where: Prisma.LeadWhereInput = {};

  if (params.status) {
    where.status = mapLeadStatus(params.status);
  }

  if (params.search && params.search.trim().length > 0) {
    const term = params.search.trim();
    where.OR = [
      { fullName: { contains: term, mode: "insensitive" } },
      { phoneNumber: { contains: term, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (params.page - 1) * params.limit,
      take: params.limit,
    }),
    prisma.lead.count({ where }),
  ]);

  return {
    items: items.map(mapLead),
    page: params.page,
    limit: params.limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / params.limit)),
  };
}

export async function getLead(id: string) {
  const item = await prisma.lead.findUnique({ where: { id } });
  return item ? mapLead(item) : null;
}

export async function updateLeadStatus(id: string, status: LeadStatusText) {
  try {
    const updated = await prisma.lead.update({
      where: { id },
      data: { status: mapLeadStatus(status) },
    });

    return mapLead(updated);
  } catch {
    return null;
  }
}

export async function deleteLead(id: string) {
  try {
    await prisma.lead.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

type CoursePayload = {
  slug?: string;
  category: string;
  title: LocalizedText;
  description: LocalizedText;
  duration: string;
  level: string;
  schedule: string;
  price: string;
  status: string;
  imageUrl?: string;
  isPublished?: boolean;
};

type TeacherPayload = {
  name: string;
  role?: LocalizedText;
  title?: LocalizedText;
  description?: LocalizedText;
  imageUrl?: string;
  experience: string;
  specialization?: string;
  isPublished?: boolean;
};

type ResultPayload = {
  studentName: string;
  examType: string;
  beforeScore: string;
  afterScore: string;
  description?: LocalizedText;
  title?: LocalizedText;
  imageUrl?: string;
  isPublished?: boolean;
};

type TestimonialPayload = {
  name: string;
  description?: LocalizedText;
  descriptor?: LocalizedText;
  imageUrl?: string;
  rating?: number;
  isPublished?: boolean;
};

function mapCourse(item: {
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
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: item.id,
    slug: item.slug,
    category: item.category,
    title: localizedFromRow(item.titleEn, item.titleRu, item.titleUz),
    description: localizedFromRow(item.descriptionEn, item.descriptionRu, item.descriptionUz),
    duration: item.duration,
    level: item.level,
    schedule: item.schedule,
    price: item.price,
    status: item.status,
    imageUrl: item.imageUrl ?? "",
    isPublished: item.isPublished,
    createdAt: toIso(item.createdAt),
    updatedAt: toIso(item.updatedAt),
  };
}

function mapTeacher(item: {
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
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: item.id,
    name: item.name,
    role: localizedFromRow(item.roleEn, item.roleRu, item.roleUz),
    title: localizedFromRow(item.name, item.name, item.name),
    description: localizedFromRow(item.bioEn, item.bioRu, item.bioUz),
    imageUrl: item.imageUrl,
    experience: item.experience,
    specialization: item.specialization,
    isPublished: item.isPublished,
    createdAt: toIso(item.createdAt),
    updatedAt: toIso(item.updatedAt),
  };
}

function mapResult(item: {
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
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: item.id,
    studentName: item.studentName,
    examType: item.examType,
    beforeScore: item.beforeScore,
    afterScore: item.afterScore,
    title: localizedFromRow(item.studentName, item.studentName, item.studentName),
    description: localizedFromRow(item.quoteEn, item.quoteRu, item.quoteUz),
    imageUrl: item.imageUrl ?? "",
    isPublished: item.isPublished,
    createdAt: toIso(item.createdAt),
    updatedAt: toIso(item.updatedAt),
  };
}

function mapTestimonial(item: {
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
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: item.id,
    name: item.name,
    title: localizedFromRow(item.name, item.name, item.name),
    description: localizedFromRow(item.quoteEn, item.quoteRu, item.quoteUz),
    descriptor: localizedFromRow(item.descriptorEn, item.descriptorRu, item.descriptorUz),
    imageUrl: item.imageUrl ?? "",
    rating: 5,
    isPublished: item.isPublished,
    createdAt: toIso(item.createdAt),
    updatedAt: toIso(item.updatedAt),
  };
}

export async function listCollection(collection: Collection) {
  if (collection === "courses") {
    const rows = await prisma.course.findMany({ orderBy: { updatedAt: "desc" } });
    return rows.map(mapCourse);
  }

  if (collection === "teachers") {
    const rows = await prisma.teacher.findMany({ orderBy: { updatedAt: "desc" } });
    return rows.map(mapTeacher);
  }

  if (collection === "results") {
    const rows = await prisma.result.findMany({ orderBy: { updatedAt: "desc" } });
    return rows.map(mapResult);
  }

  const rows = await prisma.testimonial.findMany({ orderBy: { updatedAt: "desc" } });
  return rows.map(mapTestimonial);
}

export async function createCollectionItem(collection: Collection, payload: CoursePayload | TeacherPayload | ResultPayload | TestimonialPayload) {
  if (collection === "courses") {
    const course = payload as CoursePayload;
    const title = ensureLocalized(course.title);
    const description = ensureLocalized(course.description);
    const desiredSlug = slugify(course.slug ?? title.en);
    const slug = await uniqueCourseSlug(desiredSlug);

    const created = await prisma.course.create({
      data: {
        slug,
        category: course.category,
        titleEn: ensureNonEmpty(title.en, "Untitled"),
        titleRu: ensureNonEmpty(title.ru, "Untitled"),
        titleUz: ensureNonEmpty(title.uz, "Untitled"),
        descriptionEn: description.en,
        descriptionRu: description.ru,
        descriptionUz: description.uz,
        duration: course.duration,
        level: course.level,
        schedule: course.schedule,
        price: course.price,
        status: course.status,
        imageUrl: course.imageUrl?.trim() || null,
        isPublished: course.isPublished ?? true,
      },
    });

    return mapCourse(created);
  }

  if (collection === "teachers") {
    const teacher = payload as TeacherPayload;
    const role = ensureLocalized(teacher.role);
    const bio = ensureLocalized(teacher.description);

    const created = await prisma.teacher.create({
      data: {
        name: teacher.name,
        roleEn: ensureNonEmpty(role.en, "Teacher"),
        roleRu: ensureNonEmpty(role.ru, ensureNonEmpty(role.en, "Teacher")),
        roleUz: ensureNonEmpty(role.uz, ensureNonEmpty(role.en, "Teacher")),
        bioEn: bio.en,
        bioRu: bio.ru,
        bioUz: bio.uz,
        imageUrl: teacher.imageUrl?.trim() || "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        experience: teacher.experience,
        specialization: teacher.specialization?.trim() || ensureNonEmpty(teacher.name, "General"),
        isPublished: teacher.isPublished ?? true,
      },
    });

    return mapTeacher(created);
  }

  if (collection === "results") {
    const result = payload as ResultPayload;
    const quote = ensureLocalized(result.description);

    const created = await prisma.result.create({
      data: {
        studentName: result.studentName,
        examType: result.examType,
        beforeScore: result.beforeScore,
        afterScore: result.afterScore,
        quoteEn: quote.en,
        quoteRu: quote.ru,
        quoteUz: quote.uz,
        imageUrl: result.imageUrl?.trim() || null,
        isPublished: result.isPublished ?? true,
      },
    });

    return mapResult(created);
  }

  const testimonial = payload as TestimonialPayload;
  const quote = ensureLocalized(testimonial.description);
  const descriptor = ensureLocalized(testimonial.descriptor);

  const created = await prisma.testimonial.create({
    data: {
      name: testimonial.name,
      quoteEn: quote.en,
      quoteRu: quote.ru,
      quoteUz: quote.uz,
      descriptorEn: descriptor.en,
      descriptorRu: descriptor.ru,
      descriptorUz: descriptor.uz,
      imageUrl: testimonial.imageUrl?.trim() || null,
      isPublished: testimonial.isPublished ?? true,
    },
  });

  return mapTestimonial(created);
}

export async function updateCollectionItem(collection: Collection, id: string, payload: Partial<CoursePayload | TeacherPayload | ResultPayload | TestimonialPayload>) {
  if (collection === "courses") {
    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing) return null;

    const course = payload as Partial<CoursePayload>;
    let slug = existing.slug;

    if (course.slug || course.title?.en) {
      const base = slugify(course.slug ?? course.title?.en ?? existing.titleEn);
      slug = await uniqueCourseSlug(base, id);
    }

    const updated = await prisma.course.update({
      where: { id },
      data: {
        slug,
        category: course.category ?? existing.category,
        titleEn: course.title?.en ?? existing.titleEn,
        titleRu: course.title?.ru ?? existing.titleRu,
        titleUz: course.title?.uz ?? existing.titleUz,
        descriptionEn: course.description?.en ?? existing.descriptionEn,
        descriptionRu: course.description?.ru ?? existing.descriptionRu,
        descriptionUz: course.description?.uz ?? existing.descriptionUz,
        duration: course.duration ?? existing.duration,
        level: course.level ?? existing.level,
        schedule: course.schedule ?? existing.schedule,
        price: course.price ?? existing.price,
        status: course.status ?? existing.status,
        imageUrl: course.imageUrl !== undefined ? course.imageUrl || null : existing.imageUrl,
        isPublished: course.isPublished ?? existing.isPublished,
      },
    });

    return mapCourse(updated);
  }

  if (collection === "teachers") {
    const existing = await prisma.teacher.findUnique({ where: { id } });
    if (!existing) return null;

    const teacher = payload as Partial<TeacherPayload>;
    const role = teacher.role ? ensureLocalized(teacher.role) : null;
    const bio = teacher.description ? ensureLocalized(teacher.description) : null;

    const updated = await prisma.teacher.update({
      where: { id },
      data: {
        name: teacher.name ?? existing.name,
        roleEn: role?.en ?? existing.roleEn,
        roleRu: role?.ru ?? existing.roleRu,
        roleUz: role?.uz ?? existing.roleUz,
        bioEn: bio?.en ?? existing.bioEn,
        bioRu: bio?.ru ?? existing.bioRu,
        bioUz: bio?.uz ?? existing.bioUz,
        imageUrl: teacher.imageUrl ?? existing.imageUrl,
        experience: teacher.experience ?? existing.experience,
        specialization: teacher.specialization ?? existing.specialization,
        isPublished: teacher.isPublished ?? existing.isPublished,
      },
    });

    return mapTeacher(updated);
  }

  if (collection === "results") {
    const existing = await prisma.result.findUnique({ where: { id } });
    if (!existing) return null;

    const result = payload as Partial<ResultPayload>;
    const quote = result.description ? ensureLocalized(result.description) : null;

    const updated = await prisma.result.update({
      where: { id },
      data: {
        studentName: result.studentName ?? existing.studentName,
        examType: result.examType ?? existing.examType,
        beforeScore: result.beforeScore ?? existing.beforeScore,
        afterScore: result.afterScore ?? existing.afterScore,
        quoteEn: quote?.en ?? existing.quoteEn,
        quoteRu: quote?.ru ?? existing.quoteRu,
        quoteUz: quote?.uz ?? existing.quoteUz,
        imageUrl: result.imageUrl !== undefined ? result.imageUrl || null : existing.imageUrl,
        isPublished: result.isPublished ?? existing.isPublished,
      },
    });

    return mapResult(updated);
  }

  const existing = await prisma.testimonial.findUnique({ where: { id } });
  if (!existing) return null;

  const testimonial = payload as Partial<TestimonialPayload>;
  const quote = testimonial.description ? ensureLocalized(testimonial.description) : null;
  const descriptor = testimonial.descriptor ? ensureLocalized(testimonial.descriptor) : null;

  const updated = await prisma.testimonial.update({
    where: { id },
    data: {
      name: testimonial.name ?? existing.name,
      quoteEn: quote?.en ?? existing.quoteEn,
      quoteRu: quote?.ru ?? existing.quoteRu,
      quoteUz: quote?.uz ?? existing.quoteUz,
      descriptorEn: descriptor?.en ?? existing.descriptorEn,
      descriptorRu: descriptor?.ru ?? existing.descriptorRu,
      descriptorUz: descriptor?.uz ?? existing.descriptorUz,
      imageUrl: testimonial.imageUrl !== undefined ? testimonial.imageUrl || null : existing.imageUrl,
      isPublished: testimonial.isPublished ?? existing.isPublished,
    },
  });

  return mapTestimonial(updated);
}

export async function deleteCollectionItem(collection: Collection, id: string) {
  try {
    if (collection === "courses") {
      await prisma.course.delete({ where: { id } });
      return true;
    }

    if (collection === "teachers") {
      await prisma.teacher.delete({ where: { id } });
      return true;
    }

    if (collection === "results") {
      await prisma.result.delete({ where: { id } });
      return true;
    }

    await prisma.testimonial.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

export async function getSettings() {
  const existing = await prisma.siteSetting.findFirst({ orderBy: { createdAt: "asc" } });

  if (existing) {
    return {
      phone: existing.phone,
      email: existing.email,
      telegram: existing.telegram,
      address: existing.addressEn,
      workingHours: existing.workingHoursEn,
      whatsappLink: existing.whatsapp,
      brochureLink: existing.brochureUrl,
      seoTitle: "NaviGate Academy",
      seoDescription: "Global exam preparation for IELTS, SAT, GMAT.",
    };
  }

  const created = await prisma.siteSetting.create({
    data: {
      phone: "+44 20 7946 0123",
      email: "info@navigate-academy.com",
      telegram: "@NaviGateSupport",
      whatsapp: "https://wa.me/442079460123",
      brochureUrl: "https://example.com/brochure.pdf",
      addressEn: "Level 5, Education Plaza, London, UK",
      addressRu: "Level 5, Education Plaza, London, UK",
      addressUz: "Level 5, Education Plaza, London, UK",
      workingHoursEn: "Mon-Fri 09:00-20:00",
      workingHoursRu: "Mon-Fri 09:00-20:00",
      workingHoursUz: "Mon-Fri 09:00-20:00",
    },
  });

  return {
    phone: created.phone,
    email: created.email,
    telegram: created.telegram,
    address: created.addressEn,
    workingHours: created.workingHoursEn,
    whatsappLink: created.whatsapp,
    brochureLink: created.brochureUrl,
    seoTitle: "NaviGate Academy",
    seoDescription: "Global exam preparation for IELTS, SAT, GMAT.",
  };
}

export async function updateSettings(payload: {
  phone: string;
  email: string;
  telegram: string;
  address: string;
  workingHours: string;
  whatsappLink: string;
  brochureLink: string;
  seoTitle: string;
  seoDescription: string;
}) {
  const current = await prisma.siteSetting.findFirst({ orderBy: { createdAt: "asc" } });

  const data = {
    phone: payload.phone,
    email: payload.email,
    telegram: payload.telegram,
    whatsapp: payload.whatsappLink,
    brochureUrl: payload.brochureLink,
    addressEn: payload.address,
    addressRu: payload.address,
    addressUz: payload.address,
    workingHoursEn: payload.workingHours,
    workingHoursRu: payload.workingHours,
    workingHoursUz: payload.workingHours,
  };

  if (!current) {
    await prisma.siteSetting.create({ data });
  } else {
    await prisma.siteSetting.update({ where: { id: current.id }, data });
  }

  return payload;
}

export async function getRecentLeads(limit = 10) {
  const rows = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(mapLead);
}

export async function getLeadStats() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [newLeadsLast7Days, totalLeads, enrollments] = await Promise.all([
    prisma.lead.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: LeadStatus.Enrolled } }),
  ]);

  return {
    newLeadsLast7Days,
    totalLeads,
    enrollments,
    conversionRate: totalLeads > 0 ? Number(((enrollments / totalLeads) * 100).toFixed(2)) : 0,
  };
}

export async function findAdminUserByEmail(email: string) {
  return prisma.adminUser.findUnique({ where: { email } });
}
