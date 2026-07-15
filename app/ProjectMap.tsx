"use client";

import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import type { Lang, ProjectLocation } from "./data";

type Props = {
  projects: ProjectLocation[];
  selectedId: string;
  lang: Lang;
  onSelect: (id: string) => void;
};

function MapFocus({ project }: { project: ProjectLocation }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([project.lat, project.lng], project.id === "fujairah-trade-centre" ? 11 : 12, { duration: 1.15 });
  }, [map, project]);
  return null;
}

export default function ProjectMap({ projects, selectedId, lang, onSelect }: Props) {
  const selected = projects.find((project) => project.id === selectedId) ?? projects[0];

  return (
    <MapContainer center={[25.14, 55.58]} zoom={9} scrollWheelZoom={false} zoomControl attributionControl>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <MapFocus project={selected} />
      {projects.map((project) => {
        const active = project.id === selectedId;
        return (
          <CircleMarker
            key={project.id}
            center={[project.lat, project.lng]}
            radius={active ? 12 : 8}
            pathOptions={{
              color: active ? "#f2ede3" : "#b28352",
              fillColor: project.status === "completed" ? "#b28352" : "#6c5844",
              fillOpacity: active ? 1 : 0.82,
              weight: active ? 3 : 2,
            }}
            eventHandlers={{ click: () => onSelect(project.id) }}
          >
            <Popup>
              <strong>{project.title[lang]}</strong>
              <span>{project.district} · {project.year}</span>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
