import type { Request, Response } from "express";
import { leadSchema } from "../schemas/lead.schema";
import { addLead } from "../repositories/admin.repository";
import { sendLeadToTelegram } from "../services/telegram.service";

export async function createLead(req: Request, res: Response) {
  const parsed = leadSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      errors: parsed.error.flatten(),
    });
  }

  const lead = parsed.data;

  const normalizedLead = {
    ...lead,
    preferredTime: lead.preferredTime ?? null,
    message: lead.message ?? null,
    currentLevel: lead.currentLevel ?? null,
    email: lead.email ?? null,
  };

  await addLead(normalizedLead);
  await sendLeadToTelegram(normalizedLead);

  return res.json({ ok: true });
}
