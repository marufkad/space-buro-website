import type { Lang } from "./data";
import "leaflet/dist/leaflet.css";
import "./globals.css";

export default function SiteLayout({ children, lang }: { children: React.ReactNode; lang: Lang }) {
  return <html lang={`${lang}-AE`}><body><a className="skip-link" href="#content">{lang === "ru" ? "Перейти к содержимому" : "Skip to content"}</a>{children}</body></html>;
}
