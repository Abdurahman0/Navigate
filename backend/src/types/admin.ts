export type LocaleCode = "en" | "ru" | "uz";

export type LocalizedText = {
  en: string;
  ru: string;
  uz: string;
};

export type LeadStatus = "New" | "Contacted" | "Enrolled" | "Rejected";

export type LeadRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  phoneNumber: string;
  examInterest: "IELTS" | "SAT" | "GMAT" | "GeneralEnglish";
  preferredTime: string | null;
  message: string | null;
  currentLevel: string | null;
  email: string | null;
  source: "home" | "courses" | "results" | "teachers" | "about" | "contact";
  locale: LocaleCode;
  pagePath: string;
  status: LeadStatus;
};

export type ContentBase = {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: LocalizedText;
  description: LocalizedText;
  imageUrl: string;
};

export type CourseRecord = ContentBase & {
  category: string;
  duration: string;
  level: string;
  schedule: string;
  price: string;
  status: string;
};

export type TeacherRecord = ContentBase & {
  name: string;
  role: LocalizedText;
  experience: string;
};

export type ResultRecord = ContentBase & {
  studentName: string;
  examType: string;
  beforeScore: string;
  afterScore: string;
};

export type TestimonialRecord = ContentBase & {
  name: string;
  descriptor: LocalizedText;
  rating: number;
};

export type SiteSettings = {
  phone: string;
  email: string;
  telegram: string;
  address: string;
  workingHours: string;
  whatsappLink: string;
  brochureLink: string;
  seoTitle: string;
  seoDescription: string;
};

export type AdminDb = {
  leads: LeadRecord[];
  courses: CourseRecord[];
  teachers: TeacherRecord[];
  results: ResultRecord[];
  testimonials: TestimonialRecord[];
  settings: SiteSettings;
};

