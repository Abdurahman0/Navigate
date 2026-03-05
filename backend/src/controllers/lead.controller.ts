import type { Request, Response } from "express";
import { leadSchema } from "../../../shared/lead.schema";
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

  // TODO: Persist lead to DB when driver is integrated.
  await sendLeadToTelegram(lead);

  return res.json({ ok: true });
}

