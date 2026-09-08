import { notFound, permanentRedirect } from "next/navigation";
import { projectLocations } from "../../../data";
import ProjectDetail from "../../../projects/[slug]/ProjectDetail";
import StructuredData from "../../../StructuredData";
import { projectMetadata, pathFor, siteUrl } from "../../../site";
const lang = "ru" as const;
export function generateStaticParams() { return projectLocations.filter(p => p.published).map(p => ({slug:p.id})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}) { const {slug}=await params;const p=projectLocations.find(p=>p.id===slug); return p?.published ? projectMetadata(lang,p) : {title:"Page not found",robots:{index:false,follow:false}}; }
export default async function Page({params}:{params:Promise<{slug:string}>}) {
 const {slug}=await params;
 if(slug==="china-furniture-sourcing") permanentRedirect(pathFor(lang,"/china-furniture"));
 const project=projectLocations.find(p=>p.id===slug);
 if(!project?.published) notFound();
 const url=siteUrl+pathFor(lang,`/projects/${project.id}`);
 return <><StructuredData data={{"@context":"https://schema.org","@graph":[{"@type":"CreativeWork",name:project.shortTitle[lang],description:project.summary[lang],url,image:project.images.map(i=>siteUrl+i),inLanguage:lang,creator:{"@id":siteUrl+"/#business"}},{"@type":"BreadcrumbList",itemListElement:[{"@type":"ListItem",position:1,name:"Главная",item:siteUrl+pathFor(lang)},{"@type":"ListItem",position:2,name:project.shortTitle[lang],item:url}]}]}} /><ProjectDetail key={project.id} project={project} lang={lang} /></>;
}
