import type { Metadata } from "next";
import type { Lang, ProjectLocation } from "./data";

export const siteUrl = "https://www.space-buro.ae";
export const businessName = "Space Buro Technical Services L.L.C-FZ";
export const pathFor = (lang: Lang, path = "/") => `${lang === "en" ? "/en" : ""}${path === "/" && lang === "en" ? "" : path}`;
export const projectPath = (lang: Lang, project: ProjectLocation) => pathFor(lang, project.status === "service" ? "/china-furniture" : `/projects/${project.id}`);
export const whatsapp = (text: string) => `https://wa.me/971523569697?text=${encodeURIComponent(text)}`;

export function pageMetadata(lang: Lang, path: string, title: string, description: string, image = "/media/projects/al-furjan-villa/gallery/01.webp"): Metadata {
  const url = pathFor(lang, path);
  return {
    metadataBase: new URL(siteUrl), title, description,
    alternates: { canonical: url, languages: { "ru-AE": pathFor("ru", path), "en-AE": pathFor("en", path), "x-default": pathFor("ru", path) } },
    openGraph: { title, description, url, siteName: "Space Buro", locale: lang === "ru" ? "ru_AE" : "en_AE", alternateLocale: lang === "ru" ? "en_AE" : "ru_AE", type: "website", images: [{ url: image, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    robots: { index: true, follow: true },
  };
}

export const homeMetadata = (lang: Lang) => pageMetadata(lang, "/", lang === "ru" ? "Ремонт и мебель на заказ в Дубае | Space Buro" : "Dubai Renovation & Custom Furniture | Space Buro", lang === "ru" ? "Ремонт квартир, вилл и коммерческих помещений в Дубае. Дизайн, согласования, инженерные работы и мебель на заказ. Гарантия 3 года по договору." : "Apartment, villa and commercial renovation in Dubai. Design, approvals, engineering and bespoke furniture, with a 3-year contractual warranty.");
export const chinaMetadata = (lang: Lang) => pageMetadata(lang, "/china-furniture", lang === "ru" ? "Мебель из Китая в Дубай | Space Buro" : "Furniture from China to Dubai | Space Buro", lang === "ru" ? "Подбор фабрик, образцы, контроль производства, доставка и установка мебели в ОАЭ." : "Factory sourcing, samples, production checks, furniture delivery and installation in the UAE.", "/media/china-furniture-concept.webp");
export const projectMetadata = (lang: Lang, project: ProjectLocation) => pageMetadata(lang, `/projects/${project.id}`, `${project.shortTitle[lang]} | Space Buro`, project.summary[lang], project.cover ?? project.images[0]);

export const businessSchema = {
  "@context": "https://schema.org", "@type": "GeneralContractor", "@id": `${siteUrl}/#business`, name: "Space Buro", legalName: businessName,
  url: siteUrl, telephone: "+971523569697", email: "info@space-buro.ae", logo: `${siteUrl}/space-buro-logo.png`,
  areaServed: { "@type": "City", name: "Dubai" }, address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
  sameAs: ["https://www.instagram.com/space.buro/"], knowsLanguage: ["ru", "en"],
};
