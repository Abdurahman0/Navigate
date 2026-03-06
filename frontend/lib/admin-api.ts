export type LocalizedText = { en: string; ru: string; uz: string };

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
  locale: "en" | "ru" | "uz";
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

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && init?.body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: isFormData
      ? (init?.headers ?? {})
      : {
          "Content-Type": "application/json",
          ...(init?.headers ?? {}),
        },
    ...init,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message ?? "Request failed");
  }

  return data as T;
}

export const adminApi = {
  login: (payload: { email: string; password: string }) => request<{ ok: true; user: { email: string } }>("/api/admin/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  }),
  logout: () => request<{ ok: true }>("/api/admin/auth/logout", { method: "POST" }),
  me: () => request<{ ok: boolean; user?: { email: string; role: "admin" } }>("/api/admin/auth/me"),
  dashboard: () => request<{ ok: true; stats: { newLeadsLast7Days: number; totalLeads: number; enrollments: number; conversionRate: number }; recentLeads: LeadRecord[] }>("/api/admin/dashboard"),
  leads: (query: string) => request<{ ok: true; items: LeadRecord[]; page: number; limit: number; total: number; totalPages: number }>(`/api/admin/leads${query ? `?${query}` : ""}`),
  getLead: (id: string) => request<{ ok: true; item: LeadRecord }>(`/api/admin/leads/${id}`),
  updateLeadStatus: (id: string, status: LeadStatus) => request<{ ok: true; item: LeadRecord }>(`/api/admin/leads/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  }),
  deleteLead: (id: string) => request<{ ok: true }>(`/api/admin/leads/${id}`, { method: "DELETE" }),
  listCollection: <T>(name: "courses" | "teachers" | "results" | "testimonials") => request<{ ok: true; items: T[] }>(`/api/admin/${name}`),
  createCollection: <T>(name: "courses" | "teachers" | "results" | "testimonials", payload: unknown) =>
    request<{ ok: true; item: T }>(`/api/admin/${name}`, { method: "POST", body: JSON.stringify(payload) }),
  updateCollection: <T>(name: "courses" | "teachers" | "results" | "testimonials", id: string, payload: unknown) =>
    request<{ ok: true; item: T }>(`/api/admin/${name}/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteCollection: (name: "courses" | "teachers" | "results" | "testimonials", id: string) =>
    request<{ ok: true }>(`/api/admin/${name}/${id}`, { method: "DELETE" }),
  uploadImage: (file: File) => {
    const data = new FormData();
    data.append("image", file);
    return request<{ ok: true; path: string }>("/api/admin/upload", {
      method: "POST",
      body: data,
    });
  },
  getSettings: () => request<{ ok: true; item: SiteSettings }>("/api/admin/settings"),
  updateSettings: (payload: SiteSettings) => request<{ ok: true; item: SiteSettings }>("/api/admin/settings", {
    method: "PUT",
    body: JSON.stringify(payload),
  }),
};

