import Image from "next/image";
import Link from "next/link";
import Calculator from "./Calculator";
import type { Lang } from "./data";
import { pathFor } from "./site";
import "./calculator-page.css";

export default function CalculatorPage({ lang }: { lang: Lang }) {
  const ru = lang === "ru";
  return (
    <main id="content" className="calculator-page">
      <header className="calculator-page-header">
        <Link href={pathFor(lang)} aria-label={ru ? "Space Buro — главная" : "Space Buro — home"}>
          <Image src="/space-buro-logo.png" alt="Space Buro" width={104} height={65} className="calculator-page-logo" />
        </Link>
        <nav aria-label={ru ? "Навигация" : "Navigation"}>
          <Link href={pathFor(lang)}>{ru ? "← На главную" : "← Home"}</Link>
          <Link href={pathFor(ru ? "en" : "ru", "/calculator/")} hrefLang={ru ? "en" : "ru"}>{ru ? "EN" : "RU"}</Link>
        </nav>
      </header>
      <Calculator lang={lang} headingLevel="h1" />
      <footer className="calculator-page-footer">
        <span>Space Buro · Dubai</span>
        <Link href={pathFor(lang, "/#contact")}>{ru ? "Контакты" : "Contact"}</Link>
        <Link href={pathFor(lang, "/privacy")}>{ru ? "Конфиденциальность" : "Privacy"}</Link>
      </footer>
    </main>
  );
}
