import type { ProjectMapType } from "./data";
import "./lab-map-icons.css";

// One drawing per category keeps the map and its project list in sync.
// Paths are fixed source strings; no project/user content is interpolated into SVG.
const categoryPaths: Record<ProjectMapType, readonly string[]> = {
  renovation: [
    "M4.5 4h11A1.5 1.5 0 0 1 17 5.5v3a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 8.5v-3A1.5 1.5 0 0 1 4.5 4Z",
    "M17 7h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-7v2",
    "M11 16h2v5h-2z",
  ],
  furniture: [
    "M7 12V5.5A1.5 1.5 0 0 1 8.5 4h7A1.5 1.5 0 0 1 17 5.5V12",
    "M6 12h12a1 1 0 0 1 1 1v3H5v-3a1 1 0 0 1 1-1Z",
    "M7 16v5m10-5v5M7 8h10",
  ],
  residential: [
    "m3 10 9-7 9 7",
    "M5 8.5V21h14V8.5M10 21v-7h4v7",
    "M17 6.9V3h3v6.2",
  ],
  commercial: [
    "M6 21V3h12v18M3 21h18",
    "M9 7h1m4 0h1M9 11h1m4 0h1M10 21v-6h4v6",
  ],
  architecture: [
    "M14 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z",
    "M12 1v2M10.8 6.6 5 21m8.2-14.4L19 21",
    "M7.8 14.5a7.5 7.5 0 0 0 8.4 0M12 12v6",
  ],
  china: [
    "m3 7 9-4 9 4v10l-9 4-9-4V7Z",
    "m3 7 9 4 9-4M12 11v10M7.5 5l9 4v4.5",
    "m6 14 3 1.3",
  ],
};

export function categoryIconMarkup(type: ProjectMapType): string {
  return `<svg class="project-category-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${categoryPaths[type].map((d) => `<path d="${d}"/>`).join("")}</svg>`;
}

export default function ProjectCategoryIcon({ type }: { type: ProjectMapType }) {
  return (
    <svg className="project-category-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {categoryPaths[type].map((d) => <path key={d} d={d} />)}
    </svg>
  );
}
