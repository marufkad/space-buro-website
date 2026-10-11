import type { Lang, ProjectLocation } from "./data";

/** Map labels only display an area when square metres have been confirmed. */
export function projectAreaLabel(project: ProjectLocation, lang: Lang) {
  const area = project.area[lang];
  const match = area.match(/(\d[\d\s.,]*)\s*(?:м|m)\s*(?:²|2)/i);
  return match && Number(match[1].replace(/\s/g, "").replace(",", ".")) > 0
    ? area
    : lang === "ru" ? "Площадь уточняется" : "Area to be confirmed";
}
