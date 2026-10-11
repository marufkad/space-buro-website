"use client";

import { divIcon, latLngBounds } from "leaflet";
import { Marker, MapContainer, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import type { Lang, ProjectLocation } from "./data";
import { projectAreaLabel } from "./projectArea";

type Props = {
  projects: ProjectLocation[];
  selectedId: string;
  lang: Lang;
  fitAll: boolean;
  viewRequest: number;
  onSelect: (id: string) => void;
};

// Compact, rounded app-icon markers: readable without covering the map with labels.
const markerIcons = {
  renovation: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect class="icon-surface" x="5" y="6" width="17" height="8" rx="2"/><path d="M22 10h4v8H15v4"/><rect x="12" y="22" width="6" height="7" rx="2"/></svg>',
  furniture: '<svg viewBox="0 0 32 32" aria-hidden="true"><path class="icon-surface" d="M8 16V9a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v7"/><path d="M8 16H5v10h22V16h-3M8 16v5h16v-5M9 26v3m14-3v3M16 7v13"/></svg>',
  residential: '<svg viewBox="0 0 32 32" aria-hidden="true"><path class="icon-surface" d="M7 14 16 6l9 8v13H7Z"/><path d="m4 15 12-11 12 11M13 27v-9h6v9"/><path d="M23 9V5"/></svg>',
  commercial: '<svg viewBox="0 0 32 32" aria-hidden="true"><rect class="icon-surface" x="7" y="4" width="18" height="24" rx="2"/><path d="M12 10h2m4 0h2m-8 5h2m4 0h2M13 28v-7h6v7M4 28h24"/></svg>',
  architecture: '<svg viewBox="0 0 32 32" aria-hidden="true"><path class="icon-surface" d="M6 27 16 5l10 22H6Z"/><path d="m12 21 4-9 4 9h-8ZM5 27h23M16 3v4M10 17l2 1M8 22l2 1"/></svg>',
  china: '<svg viewBox="0 0 32 32" aria-hidden="true"><path class="icon-surface" d="m5 10 11-5 11 5v13l-11 5-11-5V10Z"/><path d="m5 10 11 5 11-5M16 15v13M11 7l11 5v6M9 20l3 1.5"/></svg>',
} as const;

function MapController({ project, projects, fitAll, viewRequest }: { project: ProjectLocation; projects: ProjectLocation[]; fitAll: boolean; viewRequest: number }) {
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
      map.fitBounds(bounds, { animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches, duration: 0.8, maxZoom: 11, paddingTopLeft: [48, 48], paddingBottomRight: [48, 48] });
      return;
    }
    map.flyTo(
      [project.lat, project.lng],
      project.id === "fujairah-trade-centre" ? 13 : 14,
      { duration: 0.8, animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches },
    );
  }, [fitAll, map, project, projects, viewRequest]);

  return null;
}

function ProjectMarkers({projects, selectedId, lang, onSelect}: Omit<Props,"fitAll" | "viewRequest">) {
  const [, setView] = useState(0);
  const map = useMapEvents({zoomend:()=>setView(v=>v+1),moveend:()=>setView(v=>v+1)});
  const groups: ProjectLocation[][] = [];
  for (const project of projects) {
    const point=map.latLngToLayerPoint([project.lat,project.lng]);
    const group=groups.find(items=>map.getZoom()<16 && point.distanceTo(map.latLngToLayerPoint([items[0].lat,items[0].lng]))<48);
    if(group) group.push(project); else groups.push([project]);
  }
  return <>{groups.map(group=>{
    const project=group[0];
    if(group.length>1) {
      const bounds=latLngBounds(group.map(p=>[p.lat,p.lng] as [number,number]));
      return <Marker key={group.map(p=>p.id).join("-")} position={bounds.getCenter()} title={lang==="ru"?`${group.length} объектов — увеличить`:`${group.length} projects — zoom in`} icon={divIcon({className:"map-cluster",html:`<span>${group.length}</span>`,iconSize:[46,46]})} eventHandlers={{click:()=>map.fitBounds(bounds,{padding:[60,60],maxZoom:16,animate:!window.matchMedia("(prefers-reduced-motion: reduce)").matches})}} />;
    }
    const active=project.id===selectedId;
    const area=projectAreaLabel(project,lang);
    const icon=divIcon({className:`project-map-icon-wrap ${project.mapType}${active?" is-active":""}`,html:`<span class="project-map-icon ${project.mapType}${active?" active":""}">${markerIcons[project.mapType]}</span>`,iconSize:[48,54],iconAnchor:[24,54],popupAnchor:[0,-50]});
    return <Marker key={project.id} position={[project.lat,project.lng]} icon={icon} title={`${project.shortTitle[lang]} · ${area}`} alt={`${project.shortTitle[lang]} · ${area}`} zIndexOffset={active?1000:0} riseOnHover eventHandlers={{click:()=>onSelect(project.id)}}><Popup><strong>{project.title[lang]}</strong><span>{area}</span><span>{project.district} · {project.year}</span></Popup></Marker>;
  })}</>;
}

export default function ProjectMap({ projects, selectedId, lang, fitAll, viewRequest, onSelect }: Props) {
  const selected = projects.find(project => project.id === selectedId) ?? projects[0];
  const [tileError,setTileError]=useState(false);
  if (!selected) return null;
  return <>
    <MapContainer center={[25.1,55.2]} zoom={11} scrollWheelZoom={false} zoomControl attributionControl>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>' url={process.env.NEXT_PUBLIC_MAP_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png"} maxZoom={19} eventHandlers={{tileerror:()=>setTileError(true),loading:()=>setTileError(false)}} />
      <MapController project={selected} projects={projects} fitAll={fitAll} viewRequest={viewRequest} />
      <ProjectMarkers projects={projects} selectedId={selectedId} lang={lang} onSelect={onSelect} />
    </MapContainer>
    {tileError && <div className="map-error" role="status">{lang==="ru"?"Карта временно недоступна. Выберите объект в списке или откройте его расположение.":"The map is temporarily unavailable. Choose a project from the list or open its location."} <a href={`https://www.openstreetmap.org/?mlat=${selected.lat}&mlon=${selected.lng}#map=16/${selected.lat}/${selected.lng}`} target="_blank" rel="noreferrer">{lang==="ru"?"Открыть карту":"Open map"} ↗</a></div>}
  </>;
}
