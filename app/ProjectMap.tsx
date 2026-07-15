"use client";

import { divIcon, latLngBounds } from "leaflet";
import { Marker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import type { Lang, ProjectLocation } from "./data";

type Props = {
  projects: ProjectLocation[];
  selectedId: string;
  lang: Lang;
  fitAll: boolean;
  onSelect: (id: string) => void;
};

const markerIcons = {
  renovation: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 9h12v6H7V9Zm12 3h4v5m0 0h-3v9"/><path d="m9 23 5-5 4 4-5 5H9v-4Z"/></svg>',
  furniture: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 15h16v11H8V15Zm3 0V9h10v6M11 26v3m10-3v3M16 9v6"/></svg>',
  residential: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="m5 15 11-9 11 9v12H5V15Zm8 12v-8h6v8"/></svg>',
  commercial: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 5h18v23H7V5Zm5 5h2m4 0h2m-8 5h2m4 0h2m-8 5h2m4 0h2m-7 8v-4h6v4"/></svg>',
  china: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="m6 11 10-5 10 5-10 5-10-5Zm0 0v11l10 5 10-5V11M16 16v11"/><path d="M10 8.5 20 14m-8-7 10 5"/></svg>',
} as const;

function MapController({ project, projects, fitAll }: { project: ProjectLocation; projects: ProjectLocation[]; fitAll: boolean }) {
  const map = useMap();

  useEffect(() => {
    const resize = () => map.invalidateSize({ animate: false });
    resize();
    const firstFrame = window.requestAnimationFrame(resize);
    const timer = window.setTimeout(resize, 320);
    window.addEventListener("resize", resize);
    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.clearTimeout(timer);
      window.removeEventListener("resize", resize);
    };
  }, [map]);

  useEffect(() => {
    if (fitAll && projects.length > 1) {
      const bounds = latLngBounds(projects.map((item) => [item.lat, item.lng] as [number, number]));
      map.fitBounds(bounds, { animate: true, duration: 0.8, maxZoom: 11, padding: [48, 48] });
      return;
    }
    map.flyTo(
      [project.lat, project.lng],
      project.id === "fujairah-trade-centre" ? 10 : 12,
      { duration: 0.8 },
    );
  }, [fitAll, map, project, projects]);

  return null;
}

export default function ProjectMap({ projects, selectedId, lang, fitAll, onSelect }: Props) {
  const selected = projects.find((project) => project.id === selectedId) ?? projects[0];

  if (!selected) return null;

  return (
    <MapContainer
      center={[25.14, 55.58]}
      zoom={9}
      scrollWheelZoom={false}
      zoomControl
      attributionControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <MapController project={selected} projects={projects} fitAll={fitAll} />
      {projects.map((project) => {
        const active = project.id === selected.id;
        const icon = divIcon({
          className: "project-map-icon-wrap",
          html: `<span class="project-map-icon ${project.mapType}${active ? " active" : ""}">${markerIcons[project.mapType]}</span>`,
          iconSize: active ? [44, 44] : [36, 36],
          iconAnchor: active ? [22, 22] : [18, 18],
          popupAnchor: [0, -22],
        });

        return (
          <Marker
            key={project.id}
            position={[project.lat, project.lng]}
            icon={icon}
            eventHandlers={{ click: () => onSelect(project.id) }}
          >
            <Popup>
              <strong>{project.title[lang]}</strong>
              <span>{project.district} · {project.year}</span>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
