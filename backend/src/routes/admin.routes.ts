import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";
import {
  clearAuthCookie,
  createAdminToken,
  getTokenFromRequest,
  setAuthCookie,
  verifyToken,
} from "../middleware/admin-auth.middleware";
import {
  createCollectionItem,
  deleteCollectionItem,
  deleteLead,
  findAdminUserByEmail,
  getLead,
  getLeadStats,
  getRecentLeads,
  getSettings,
  listCollection,
  listLeads,
  updateCollectionItem,
  updateLeadStatus,
  updateSettings,
} from "../repositories/admin.repository";
import {
  adminLeadStatusSchema,
  courseSchema,
  loginSchema,
  paginationSchema,
  resultSchema,
  settingsSchema,
  teacherSchema,
  testimonialSchema,
} from "../schemas/admin.schema";
import { requireAdminAuth } from "../middleware/admin-auth.middleware";

const collectionSchemas = {
  courses: courseSchema,
  teachers: teacherSchema,
  results: resultSchema,
  testimonials: testimonialSchema,
} as const;

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

const mediaStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.resolve(process.cwd(), "media"));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    cb(null, `${Date.now()}-${randomUUID()}${ext || ".jpg"}`);
  },
});

const upload = multer({
  storage: mediaStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
      return;
    }
    cb(new Error("Only image files are allowed"));
  },
});

export const adminRouter = Router();

adminRouter.post("/auth/login", loginLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, errors: parsed.error.flatten() });
  }

  const admin = await findAdminUserByEmail(parsed.data.email);
  if (!admin) {
    return res.status(401).json({ ok: false, message: "Invalid credentials" });
  }

  const validPassword = await bcrypt.compare(parsed.data.password, admin.passwordHash);
  if (!validPassword) {
    return res.status(401).json({ ok: false, message: "Invalid credentials" });
  }

  const token = createAdminToken(admin.email);
  setAuthCookie(res, token);

  return res.json({ ok: true, user: { email: admin.email } });
});

adminRouter.post("/auth/logout", (_req, res) => {
  clearAuthCookie(res);
  return res.json({ ok: true });
});

adminRouter.get("/auth/me", (req, res) => {
  const token = getTokenFromRequest(req);
  if (!token) return res.status(401).json({ ok: false });

  try {
    const payload = verifyToken(token);
    return res.json({ ok: true, user: payload });
  } catch {
    return res.status(401).json({ ok: false });
  }
});

adminRouter.use(requireAdminAuth);

adminRouter.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, message: "Image file is required" });
  }

  return res.status(201).json({
    ok: true,
    path: `/media/${req.file.filename}`,
  });
});

adminRouter.get("/dashboard", async (_req, res) => {
  const [stats, recentLeads] = await Promise.all([getLeadStats(), getRecentLeads(10)]);
  return res.json({ ok: true, stats, recentLeads });
});

adminRouter.get("/leads", async (req, res) => {
  const parsed = paginationSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, errors: parsed.error.flatten() });
  }

  const data = await listLeads(parsed.data);
  return res.json({ ok: true, ...data });
});

adminRouter.get("/leads/:id", async (req, res) => {
  const lead = await getLead(req.params.id);
  if (!lead) return res.status(404).json({ ok: false, message: "Lead not found" });
  return res.json({ ok: true, item: lead });
});

adminRouter.patch("/leads/:id/status", async (req, res) => {
  const parsed = z.object({ status: adminLeadStatusSchema }).safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, errors: parsed.error.flatten() });
  }

  const updated = await updateLeadStatus(req.params.id, parsed.data.status);
  if (!updated) return res.status(404).json({ ok: false, message: "Lead not found" });

  return res.json({ ok: true, item: updated });
});

adminRouter.delete("/leads/:id", async (req, res) => {
  const deleted = await deleteLead(req.params.id);
  if (!deleted) return res.status(404).json({ ok: false, message: "Lead not found" });
  return res.json({ ok: true });
});

function registerCollectionRoutes(pathKey: keyof typeof collectionSchemas) {
  const schema = collectionSchemas[pathKey];

  adminRouter.get(`/${pathKey}`, async (_req, res) => {
    const items = await listCollection(pathKey);
    return res.json({ ok: true, items });
  });

  adminRouter.post(`/${pathKey}`, async (req, res) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, errors: parsed.error.flatten() });
    }

    const item = await createCollectionItem(pathKey, parsed.data as never);
    return res.status(201).json({ ok: true, item });
  });

  adminRouter.put(`/${pathKey}/:id`, async (req, res) => {
    const parsed = schema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, errors: parsed.error.flatten() });
    }

    const item = await updateCollectionItem(pathKey, req.params.id, parsed.data as never);
    if (!item) return res.status(404).json({ ok: false, message: "Item not found" });

    return res.json({ ok: true, item });
  });

  adminRouter.delete(`/${pathKey}/:id`, async (req, res) => {
    const deleted = await deleteCollectionItem(pathKey, req.params.id);
    if (!deleted) return res.status(404).json({ ok: false, message: "Item not found" });

    return res.json({ ok: true });
  });
}

registerCollectionRoutes("courses");
registerCollectionRoutes("teachers");
registerCollectionRoutes("results");
registerCollectionRoutes("testimonials");

adminRouter.get("/settings", async (_req, res) => {
  const item = await getSettings();
  return res.json({ ok: true, item });
});

adminRouter.put("/settings", async (req, res) => {
  const parsed = settingsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ ok: false, errors: parsed.error.flatten() });
  }

  const item = await updateSettings(parsed.data);
  return res.json({ ok: true, item });
});
