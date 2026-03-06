"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { leadSchema, type LeadInput } from "@/lib/lead.schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Locale } from "@/i18n/routing";

type LeadCaptureSource = "home" | "courses" | "results" | "teachers" | "about" | "contact";
type LeadCaptureVariant = "compact" | "standard";

type LeadCaptureFormProps = {
  source: LeadCaptureSource;
  variant?: LeadCaptureVariant;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
};

const examOptions = ["IELTS", "SAT", "GMAT", "GeneralEnglish"] as const;
const currentLevelOptions = ["Beginner", "Intermediate", "Advanced", "HighSchool", "Undergraduate", "Postgraduate"] as const;

export function LeadCaptureForm({
  source,
  variant = "standard",
  title,
  subtitle,
  submitLabel,
}: LeadCaptureFormProps) {
  const t = useTranslations("leadCapture");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [apiState, setApiState] = useState<"idle" | "success" | "error">("idle");

  const form = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      examInterest: "IELTS",
      preferredTime: null,
      message: null,
      currentLevel: null,
      email: null,
      source,
      locale,
      pagePath: pathname || `/${locale}`,
    },
  });

  async function onSubmit(values: LeadInput) {
    setApiState("idle");

    const payload: LeadInput = {
      fullName: values.fullName,
      phoneNumber: values.phoneNumber,
      examInterest: values.examInterest,
      preferredTime: values.preferredTime || null,
      message: values.message || null,
      currentLevel: values.currentLevel || null,
      email: values.email || null,
      source,
      locale,
      pagePath: pathname || `/${locale}`,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("request_failed");
      }

      setApiState("success");
      form.reset({
        fullName: "",
        phoneNumber: "",
        examInterest: "IELTS",
        preferredTime: null,
        message: null,
        currentLevel: null,
        email: null,
        source,
        locale,
        pagePath: pathname || `/${locale}`,
      });
    } catch {
      setApiState("error");
    }
  }

  return (
    <div className={`w-full rounded-2xl bg-card/50 p-6 shadow-lg ring-1 ring-border/20 dark:ring-white/10 ${variant === "compact" ? "md:p-6" : "md:p-10"}`}>
      {title ? <h3 className="text-2xl font-bold tracking-tight">{title}</h3> : null}
      {subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={`${title || subtitle ? "mt-5" : ""} space-y-4`}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("label.fullName")}</FormLabel>
                  <FormControl>
                    <Input className="min-h-[44px]" placeholder={t("placeholder.fullName")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("label.phoneNumber")}</FormLabel>
                  <FormControl>
                    <Input className="min-h-[44px]" placeholder={t("placeholder.phoneNumber")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("label.email")}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="min-h-[44px]"
                      placeholder={t("placeholder.email")}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferredTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("label.preferredTime")}</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      className="min-h-[44px]"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="examInterest"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("label.examInterest")}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="min-h-[44px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {examOptions.map((item) => (
                          <SelectItem key={item} value={item}>
                            {t(`exam.${item}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("label.currentLevel")}</FormLabel>
                  <FormControl>
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <SelectTrigger className="min-h-[44px]">
                        <SelectValue placeholder={t("placeholder.currentLevel")} />
                      </SelectTrigger>
                      <SelectContent>
                        {currentLevelOptions.map((item) => (
                          <SelectItem key={item} value={item}>
                            {t(`level.${item}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("label.message")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("placeholder.message")}
                    className="min-h-[120px] resize-none"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="min-h-[44px] w-full cursor-pointer transition duration-200 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-red-500/60"
            disabled={form.formState.isSubmitting}
          >
            {submitLabel ?? t("button.submit")}
          </Button>

          {apiState === "success" ? <p className="text-sm font-medium text-emerald-600">{t("toast.success")}</p> : null}
          {apiState === "error" ? <p className="text-sm font-medium text-red-600">{t("toast.error")}</p> : null}
        </form>
      </Form>
    </div>
  );
}
