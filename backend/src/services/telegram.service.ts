import type { LeadInput } from "../schemas/lead.schema";

const TELEGRAM_API = "https://api.telegram.org";

export async function sendLeadToTelegram(lead: LeadInput) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.log("[telegram] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    console.log("[telegram] Lead:", lead);
    return;
  }

  const text = [
    "New NaviGate lead:",
    `Full Name: ${lead.fullName}`,
    `Phone Number: ${lead.phoneNumber}`,
    `Exam: ${lead.examInterest}`,
    `Source: ${lead.source}`,
    `Locale: ${lead.locale}`,
    `Page: ${lead.pagePath}`,
    lead.email ? `Email: ${lead.email}` : null,
    lead.message ? `Message: ${lead.message}` : null,
    lead.preferredTime ? `Preferred time: ${lead.preferredTime}` : null,
    lead.currentLevel ? `Current level: ${lead.currentLevel}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  });

  if (!response.ok) {
    const payload = await response.text();
    console.error("[telegram] Failed to send message:", payload);
  }
}
