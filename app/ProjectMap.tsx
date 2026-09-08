"use client";

import { divIcon, latLngBounds } from "leaflet";
import { Marker, MapContainer, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import type { Lang, ProjectLocation } from "./data";

type Props = {
  projects: ProjectLocation[];
  selectedId: string;
  lang: Lang;
  fitAll: boolean;
  viewRequest: number;
  onSelect: (id: string) => void;
};

const markerIcons = {
  renovation: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 9h12v6H7V9Zm12 3h4v5m0 0h-3v9"/><path d="m9 23 5-5 4 4-5 5H9v-4Z"/></svg>',
  furniture: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 15h16v11H8V15Zm3 0V9h10v6M11 26v3m10-3v3M16 9v6"/></svg>',
  residential: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="m5 15 11-9 11 9v12H5V15Zm8 12v-8h6v8"/></svg>',
  commercial: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 5h18v23H7V5Zm5 5h2m4 0h2m-8 5h2m4 0h2m-8 5h2m4 0h2m-7 8v-4h6v4"/></svg>',
  architecture: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 26h22M8 26V12l8-6 8 6v14M12 26v-8h8v8M8 13h16M16 6v7"/></svg>',
  china: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="m6 11 10-5 10 5-10 5-10-5Zm0 0v11l10 5 10-5V11M16 16v11"/><path d="M10 8.5 20 14m-8-7 10 5"/></svg>',
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
      map.fitBounds(bounds, { animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches, duration: 0.8, maxZoom: 11, padding: [48, 48] });
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
    const icon=divIcon({className:"project-map-icon-wrap",html:`<span class="project-map-icon ${project.mapType}${active?" active":""}">${markerIcons[project.mapType]}</span>`,iconSize:active?[44,50]:[36,42],iconAnchor:active?[22,50]:[18,42],popupAnchor:[0,-46]});
    return <Marker key={project.id} position={[project.lat,project.lng]} icon={icon} title={project.shortTitle[lang]} eventHandlers={{click:()=>onSelect(project.id)}}><Popup><strong>{project.title[lang]}</strong><span>{project.district} · {project.year}</span></Popup></Marker>;
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
