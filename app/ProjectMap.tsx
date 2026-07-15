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

const markerLabels = {
  fitout: "F",
  furniture: "M",
  china: "CN",
  commercial: "C",
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
        attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a>'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
      />
      <MapController project={selected} projects={projects} fitAll={fitAll} />
      {projects.map((project) => {
        const active = project.id === selected.id;
        const icon = divIcon({
          className: "project-map-icon-wrap",
          html: `<span class="project-map-icon ${project.category}${active ? " active" : ""}">${markerLabels[project.category]}</span>`,
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
