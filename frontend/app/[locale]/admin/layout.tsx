import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  return <AdminShell locale={params.locale}>{children}</AdminShell>;
}
