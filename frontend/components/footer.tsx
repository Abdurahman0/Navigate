import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { FaFacebookF, FaInstagram, FaTelegramPlane } from "react-icons/fa";

function localePath(locale: string, slug = "") {
  return `/${locale}${slug}`;
}

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <footer className="border-t border-border/60 bg-muted/20">
      <div className="site-container py-14 md:py-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <p className="text-lg font-bold">{t("brand")}</p>
            <p className="text-sm text-muted-foreground">{t("brandDescription")}</p>
            <div className="flex gap-3">
              <Link href="https://facebook.com" className="rounded-full border p-3 transition-colors hover:bg-muted" aria-label="facebook">
                <FaFacebookF />
              </Link>
              <Link href="https://instagram.com" className="rounded-full border p-3 transition-colors hover:bg-muted" aria-label="instagram">
                <FaInstagram />
              </Link>
              <Link href="https://t.me" className="rounded-full border p-3 transition-colors hover:bg-muted" aria-label="telegram">
                <FaTelegramPlane />
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-semibold">{t("exams.title")}</p>
            <Link href={localePath(locale, "/courses")} className="block text-sm text-muted-foreground hover:text-foreground">
              {t("exams.ielts")}
            </Link>
            <Link href={localePath(locale, "/courses")} className="block text-sm text-muted-foreground hover:text-foreground">
              {t("exams.sat")}
            </Link>
            <Link href={localePath(locale, "/courses")} className="block text-sm text-muted-foreground hover:text-foreground">
              {t("exams.gmat")}
            </Link>
            <Link href={localePath(locale, "/courses")} className="block text-sm text-muted-foreground hover:text-foreground">
              {t("exams.pte")}
            </Link>
          </div>

          <div className="space-y-3">
            <p className="font-semibold">{t("company.title")}</p>
            <Link href={localePath(locale, "/about")} className="block text-sm text-muted-foreground hover:text-foreground">
              {t("company.about")}
            </Link>
            <Link href={localePath(locale, "/results")} className="block text-sm text-muted-foreground hover:text-foreground">
              {t("company.success")}
            </Link>
            <Link href={localePath(locale, "/teachers")} className="block text-sm text-muted-foreground hover:text-foreground">
              {t("company.careers")}
            </Link>
            <Link href={localePath(locale, "/contact")} className="block text-sm text-muted-foreground hover:text-foreground">
              {t("company.contact")}
            </Link>
          </div>

          <div className="space-y-3">
            <p className="font-semibold">{t("contact.title")}</p>
            <p className="text-sm text-muted-foreground">{t("contact.address")}</p>
            <Link href="tel:+442079460123" className="block text-sm text-muted-foreground hover:text-foreground">
              {t("contact.phone")}
            </Link>
            <Link href="mailto:info@navigate-academy.com" className="block text-sm text-muted-foreground hover:text-foreground">
              {t("contact.email")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
