"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLead = createLead;
const lead_schema_1 = require("../../../shared/lead.schema");
const telegram_service_1 = require("../services/telegram.service");
async function createLead(req, res) {
    const parsed = lead_schema_1.leadSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            ok: false,
            errors: parsed.error.flatten(),
        });
    }
    const lead = parsed.data;
    // TODO: Persist lead to DB when driver is integrated.
    await (0, telegram_service_1.sendLeadToTelegram)(lead);
    return res.json({ ok: true });
}
