"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/admin-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
type LoginValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage({ params }: { params: { locale: string } }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });

  async function onSubmit(values: LoginValues) {
    setError(null);
    try {
      await adminApi.login(values);
      router.push(`/${params.locale}/admin`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader><CardTitle>Admin Login</CardTitle></CardHeader>
        <CardContent>
          <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} className="min-h-[44px]" /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="password" render={({ field }) => (<FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} className="min-h-[44px]" /></FormControl><FormMessage /></FormItem>)} />
            <Button type="submit" className="w-full">Sign In</Button>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </form></Form>
        </CardContent>
      </Card>
    </div>
  );
}
