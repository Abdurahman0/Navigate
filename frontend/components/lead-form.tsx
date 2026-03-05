"use client";

import { LeadCaptureForm } from "./lead-capture-form";

type LeadFormProps = {
  source?: "home" | "courses" | "results" | "teachers" | "about" | "contact";
};

export function LeadForm({ source = "home" }: LeadFormProps) {
  return <LeadCaptureForm source={source} variant="compact" />;
}
