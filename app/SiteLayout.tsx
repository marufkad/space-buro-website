import type { Lang } from "./data";
import SiteMotion from "./SiteMotion";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import "./lab-intro.css";
import "./lab-advantages.css";
import "./lab-people-process.css";
import "./lab-layout.css";
import "./lab-motion.css";

export default function SiteLayout({ children, lang }: { children: React.ReactNode; lang: Lang }) {
  return <html lang={`${lang}-AE`}><body><a className="skip-link" href="#content">{lang === "ru" ? "Перейти к содержимому" : "Skip to content"}</a>{children}<SiteMotion /></body></html>;
}
