import { z } from "zod";

export const localizedTextSchema = z.object({
  en: z.string().min(1),
  ru: z.string().min(1),
  uz: z.string().min(1),
});

export const adminLeadStatusSchema = z.enum(["New", "Contacted", "Enrolled", "Rejected"]);

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: adminLeadStatusSchema.optional(),
  search: z.string().optional(),
});

export const contentBaseSchema = z.object({
  title: localizedTextSchema,
  description: localizedTextSchema,
  imageUrl: z.string().url().optional(),
});

export const courseSchema = contentBaseSchema.extend({
  slug: z.string().min(1).optional(),
  category: z.string().min(1),
  duration: z.string().min(1),
  level: z.string().min(1),
  schedule: z.string().min(1),
  price: z.string().min(1),
  status: z.string().min(1),
  isPublished: z.boolean().optional(),
});

export const teacherSchema = contentBaseSchema.extend({
  name: z.string().min(2),
  role: localizedTextSchema,
  experience: z.string().min(1),
  specialization: z.string().min(1).optional(),
  isPublished: z.boolean().optional(),
});

export const resultSchema = contentBaseSchema.extend({
  studentName: z.string().min(2),
  examType: z.string().min(1),
  beforeScore: z.string().min(1),
  afterScore: z.string().min(1),
  isPublished: z.boolean().optional(),
});

export const testimonialSchema = contentBaseSchema.extend({
  name: z.string().min(2),
  descriptor: localizedTextSchema,
  rating: z.number().int().min(1).max(5).optional(),
  isPublished: z.boolean().optional(),
});

export const settingsSchema = z.object({
  phone: z.string().min(1),
  email: z.string().email(),
  telegram: z.string().min(1),
  address: z.string().min(1),
  workingHours: z.string().min(1),
  whatsappLink: z.string().url(),
  brochureLink: z.string().url(),
  seoTitle: z.string().min(1),
  seoDescription: z.string().min(1),
});
