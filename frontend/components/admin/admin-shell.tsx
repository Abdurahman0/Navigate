"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiHome, FiBookOpen, FiUsers, FiTrendingUp, FiMessageSquare, FiSettings, FiInbox, FiLogOut, FiMenu } from "react-icons/fi";
import { adminApi } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";

type AdminShellProps = {
  locale: string;
  children: React.ReactNode;
};

const navItems = [
  { key: "dashboard", icon: FiHome, path: "" },
  { key: "leads", icon: FiInbox, path: "/leads" },
  { key: "courses", icon: FiBookOpen, path: "/courses" },
  { key: "teachers", icon: FiUsers, path: "/teachers" },
  { key: "results", icon: FiTrendingUp, path: "/results" },
  { key: "testimonials", icon: FiMessageSquare, path: "/testimonials" },
  { key: "settings", icon: FiSettings, path: "/settings" },
] as const;

function Sidebar({ locale, pathname, onNavigate }: { locale: string; pathname: string; onNavigate?: () => void }) {
  return (
    <aside className="flex h-full flex-col gap-3 p-4">
      <div className="px-2 py-3 text-lg font-bold">NaviGate Admin</div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const href = `/${locale}/admin${item.path}`;
          const active = pathname === href;
          const Icon = item.icon;

          return (
            <Link
              key={item.key}
              href={href}
              onClick={onNavigate}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
              <Icon className="h-4 w-4" />
              <span className="capitalize">{item.key}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function AdminShell({ locale, children }: AdminShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isLoginPage = pathname === `/${locale}/admin/login`;

  async function handleLogout() {
    try {
      await adminApi.logout();
    } finally {
      window.location.href = `/${locale}/admin/login`;
    }
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  const titleFromPath = navItems.find((item) => `/${locale}/admin${item.path}` === pathname)?.key ?? "dashboard";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
        <div className="hidden border-r bg-card/60 lg:block">
          <Sidebar locale={locale} pathname={pathname} />
        </div>

        <div className="flex min-w-0 flex-col">
          <header className="flex items-center justify-between gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur md:px-6">
            <div className="flex items-center gap-2">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10 w-10 p-0 lg:hidden" aria-label="Open admin navigation">
                    <FiMenu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-72 p-0">
                  <Sidebar locale={locale} pathname={pathname} onNavigate={() => setOpen(false)} />
                </SheetContent>
              </Sheet>
              <h1 className="text-base font-semibold capitalize md:text-lg">{titleFromPath}</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="outline" size="sm" className="cursor-pointer" onClick={handleLogout}>
                <FiLogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </header>
          <main className="min-w-0 flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

