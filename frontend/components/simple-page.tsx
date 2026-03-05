import { useTranslations } from "next-intl";

type SimplePageProps = {
  translationKey: "courses" | "results" | "teachers" | "about" | "contact";
};

export function SimplePage({ translationKey }: SimplePageProps) {
  const t = useTranslations(`pages.${translationKey}`);

  return (
    <main className="site-container py-14 md:py-20">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{t("title")}</h1>
      <p className="mt-4 max-w-prose text-muted-foreground">{t("description")}</p>
    </main>
  );
}
