"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { adminApi, type SiteSettings } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const settingsSchema = z.object({
  phone: z.string().min(1),
  email: z.string().email(),
  telegram: z.string().min(1),
  address: z.string().min(1),
  workingHours: z.string().min(1),
  whatsappLink: z.string().url(),
  brochureLink: z.string().url(),
  seoTitle: z.string().min(1),
  seoDescription: z.string().min(1),
});
type SettingsValues = z.infer<typeof settingsSchema>;
const fieldOrder: Array<keyof SettingsValues> = ["phone","email","telegram","address","workingHours","whatsappLink","brochureLink","seoTitle","seoDescription"];

export default function AdminSettingsPage() {
  const [message, setMessage] = useState<string | null>(null);
  const form = useForm<SettingsValues>({ resolver: zodResolver(settingsSchema), defaultValues: { phone: "", email: "", telegram: "", address: "", workingHours: "", whatsappLink: "", brochureLink: "", seoTitle: "", seoDescription: "" } });

  useEffect(() => { adminApi.getSettings().then(({ item }) => form.reset(item as SiteSettings)); }, [form]);
  async function onSubmit(values: SettingsValues) { await adminApi.updateSettings(values); setMessage("Settings saved"); }

  return (
    <Card>
      <CardHeader><CardTitle>Site Settings</CardTitle></CardHeader>
      <CardContent>
        <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {fieldOrder.map((fieldName) => (
              <FormField key={fieldName} control={form.control} name={fieldName} render={({ field }) => (
                <FormItem className={fieldName === "seoDescription" || fieldName === "address" ? "md:col-span-2" : ""}>
                  <FormLabel>{fieldName}</FormLabel>
                  <FormControl><Input className="min-h-[44px]" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            ))}
          </div>
          <Button type="submit" className="min-h-[44px] cursor-pointer">Save Settings</Button>
          {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
        </form></Form>
      </CardContent>
    </Card>
  );
}
