"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

type SiteShellProps = {
  children: React.ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  const segments = useSelectedLayoutSegments();
  const isAdminRoute = segments[0] === "admin";

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
