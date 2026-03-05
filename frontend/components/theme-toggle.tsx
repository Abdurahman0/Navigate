"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="outline" size="sm" aria-label="theme-toggle" />;
  }

  const dark = resolvedTheme === "dark";

  return (
    <Button variant="outline" size="sm" onClick={() => setTheme(dark ? "light" : "dark")} aria-label="theme-toggle">
      {dark ? <BsSunFill className="h-4 w-4" /> : <BsMoonStarsFill className="h-4 w-4" />}
    </Button>
  );
}

