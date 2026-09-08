import type { MetadataRoute } from "next";
import { projectLocations } from "./data";
import { pathFor, siteUrl } from "./site";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/china-furniture", "/privacy", ...projectLocations.filter(p => p.published && p.status !== "service").map(p => `/projects/${p.id}`)];
  return paths.flatMap(path => (["ru", "en"] as const).map(lang => ({ url: `${siteUrl}${pathFor(lang, path)}`, alternates: { languages: { "ru-AE": `${siteUrl}${pathFor("ru", path)}`, "en-AE": `${siteUrl}${pathFor("en", path)}`, "x-default": `${siteUrl}${pathFor("ru", path)}` } } })));
}
