"use client";

import { divIcon, latLngBounds } from "leaflet";
import { Marker, MapContainer, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { memo, useEffect, useState } from "react";
import type { Lang, ProjectLocation } from "./data";
import { projectAreaLabel } from "./projectArea";
import { categoryIconMarkup } from "./ProjectCategoryIcon";
import ResponsiveArrow from "./ResponsiveArrow";

type Props = {
  projects: ProjectLocation[];
  selectedId: string;
  lang: Lang;
  fitAll: boolean;
  viewRequest: number;
  onSelect: (id: string) => void;
};

function MapController({ project, projects, fitAll, viewRequest }: { project: ProjectLocation; projects: ProjectLocation[]; fitAll: boolean; viewRequest: number }) {
  const map = useMap();

  useEffect(() => {
    const resize = () => map.invalidateSize({ animate: false });
    resize();
    let frame = 0;
    const queueResize = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(resize);
    };
    const observer = new ResizeObserver(queueResize);
    observer.observe(map.getContainer());
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
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
      return <Marker key={group.map(p=>p.id).join("-")} position={bounds.getCenter()} title={lang==="ru"?`${group.length} объектов — увеличить`:`${group.length} projects — zoom in`} icon={divIcon({className:"map-cluster map-cluster-refined",html:`<span>${group.length}</span>`,iconSize:[46,46]})} eventHandlers={{click:()=>map.fitBounds(bounds,{padding:[60,60],maxZoom:16,animate:!window.matchMedia("(prefers-reduced-motion: reduce)").matches})}} />;
    }
    const active=project.id===selectedId;
    const area=projectAreaLabel(project,lang);
    const icon=divIcon({className:`project-map-icon-wrap map-marker-refined ${project.mapType}${active?" is-active":""}`,html:`<span class="project-map-icon ${project.mapType}${active?" active":""}">${categoryIconMarkup(project.mapType)}</span>`,iconSize:[48,54],iconAnchor:[24,54],popupAnchor:[0,-50]});
    return <Marker key={project.id} position={[project.lat,project.lng]} icon={icon} title={`${project.shortTitle[lang]} · ${area}`} alt={`${project.shortTitle[lang]} · ${area}`} zIndexOffset={active?1000:0} riseOnHover eventHandlers={{click:()=>onSelect(project.id)}}><Popup><strong>{project.title[lang]}</strong><span>{area}</span><span>{project.district} · {project.year}</span></Popup></Marker>;
  })}</>;
}

const ProjectMap = memo(function ProjectMap({ projects, selectedId, lang, fitAll, viewRequest, onSelect }: Props) {
  const selected = projects.find(project => project.id === selectedId) ?? projects[0];
  const [tileError,setTileError]=useState(false);
  if (!selected) return null;
  const overviewBounds = fitAll && projects.length > 1
    ? latLngBounds(projects.map(project => [project.lat, project.lng] as [number, number]))
    : undefined;
  return <>
    <MapContainer
      center={overviewBounds ? undefined : [selected.lat, selected.lng]}
      zoom={overviewBounds ? undefined : selected.id === "fujairah-trade-centre" ? 13 : 14}
      bounds={overviewBounds}
      boundsOptions={{ maxZoom: 11, padding: [48, 48] }}
      scrollWheelZoom={false}
      zoomControl
      attributionControl
    >
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>' url={process.env.NEXT_PUBLIC_MAP_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png"} maxZoom={19} eventHandlers={{tileerror:()=>setTileError(true),loading:()=>setTileError(false)}} />
      <MapController project={selected} projects={projects} fitAll={fitAll} viewRequest={viewRequest} />
      <ProjectMarkers projects={projects} selectedId={selectedId} lang={lang} onSelect={onSelect} />
    </MapContainer>
    {tileError && <div className="map-error" role="status">{lang==="ru"?"Карта временно недоступна. Выберите объект в списке или откройте его расположение.":"The map is temporarily unavailable. Choose a project from the list or open its location."} <a href={`https://www.openstreetmap.org/?mlat=${selected.lat}&mlon=${selected.lng}#map=16/${selected.lat}/${selected.lng}`} target="_blank" rel="noreferrer">{lang==="ru"?"Открыть карту":"Open map"} <ResponsiveArrow /></a></div>}
  </>;
});

export default ProjectMap;
