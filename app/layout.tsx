import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ремонт помещений и мебель на заказ в Дубае | Space Buro",
  description: "Ремонт квартир, вилл и коммерческих помещений в Дубае. Собственная команда, мебельное производство, прозрачная смета и гарантия по договору.",
  keywords: ["ремонт в Дубае", "fit-out Dubai", "мебель на заказ Dubai", "interior renovation Dubai"],
  metadataBase: new URL("https://www.space-buro.ae"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Space Buro — ремонт и мебель на заказ в Дубае",
    description: "От пустого помещения до полностью готового интерьера.",
    url: "/",
    siteName: "Space Buro",
    locale: "ru_AE",
    type: "website",
    images: [{ url: "/hero-room.webp", width: 1586, height: 992, alt: "Space Buro interior in Dubai" }],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru-AE"><body>{children}</body></html>;
}
