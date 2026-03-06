import { Router } from "express";
import { prisma } from "../lib/prisma";

export const publicRouter = Router();

publicRouter.get("/courses", async (_req, res) => {
  const items = await prisma.course.findMany({
    where: { isPublished: true },
    orderBy: { updatedAt: "desc" },
  });

  return res.json({ ok: true, items });
});

publicRouter.get("/teachers", async (_req, res) => {
  const items = await prisma.teacher.findMany({
    where: { isPublished: true },
    orderBy: { updatedAt: "desc" },
  });

  return res.json({ ok: true, items });
});

publicRouter.get("/results", async (_req, res) => {
  const items = await prisma.result.findMany({
    where: { isPublished: true },
    orderBy: { updatedAt: "desc" },
  });

  return res.json({ ok: true, items });
});

publicRouter.get("/testimonials", async (_req, res) => {
  const items = await prisma.testimonial.findMany({
    where: { isPublished: true },
    orderBy: { updatedAt: "desc" },
  });

  return res.json({ ok: true, items });
});

publicRouter.get("/settings", async (_req, res) => {
  const item = await prisma.siteSetting.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (!item) {
    return res.json({ ok: true, item: null });
  }

  return res.json({ ok: true, item });
});

