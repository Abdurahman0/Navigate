import { z } from "zod";

export const examInterestEnum = z.enum(["IELTS", "SAT", "GMAT", "GeneralEnglish"]);
export const sourceEnum = z.enum(["home", "courses", "results", "teachers", "about", "contact"]);
export const localeEnum = z.enum(["en", "ru", "uz"]);

export const leadSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  phoneNumber: z.string().trim().min(7).max(30),
  examInterest: examInterestEnum,
  preferredTime: z.string().min(1).nullable().optional(),
  message: z.string().trim().max(1000).nullable().optional(),
  currentLevel: z.string().min(1).nullable().optional(),
  email: z.string().trim().email().nullable().optional(),
  source: sourceEnum,
  locale: localeEnum,
  pagePath: z.string().trim().min(1),
});

export type LeadInput = z.infer<typeof leadSchema>;
