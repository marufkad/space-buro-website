"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { projectLocations, team, type Lang, type ProjectCategory, type ProjectLocation } from "../../data";
import { pathFor, projectPath, whatsapp } from "../../site";
import { projectBriefs } from "../../caseStudies";
import { useDialog } from "../../useInteraction";

const categories: Record<Lang, Record<ProjectCategory,string>> = {
  ru: {renovation:"Реновация",furniture:"Мебель",residential:"Жильё",commercial:"Коммерция",architecture:"Архитектура",china:"Мебель из Китая"},
  en: {renovation:"Renovation",furniture:"Furniture",residential:"Residential",commercial:"Commercial",architecture:"Architecture",china:"Furniture from China"},
};

export default function ProjectDetail({ project, lang }: { project: ProjectLocation; lang: Lang }) {
  const ru = lang === "ru";
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const before = useMemo(() => project.beforeImages ?? [], [project.beforeImages]);
  const primary = useMemo(() => project.images.filter(image => !before.includes(image)), [project.images,before]);
  const design = project.id === "al-bateen-residences-jbr" || project.id === "elemental-day-surgery-clinic";
  const primaryLabel = design ? (ru ? "Визуализация" : "Design visualisation") : (ru ? "Результат" : "Completed work");
  const beforeLabel = project.beforeLabel?.[lang] ?? (ru ? "До ремонта" : "Before renovation");
  const [gallery, setGallery] = useState(primary.length ? "primary" : "before");
  const photos = useMemo(() => gallery === "primary" ? primary : gallery === "before" ? before : [...primary, ...before], [gallery,primary,before]);
  const caption = (image: string) => before.includes(image) ? beforeLabel : primaryLabel;
  const visiblePhotos = expanded ? photos : photos.slice(0,12);
  const close = useCallback(() => setLightbox(null), []);
  const dialogRef = useDialog(Boolean(lightbox), close);
  const participants = team.filter(member => project.teamIds.includes(member.id));
  const published = projectLocations.filter(p => p.published && p.status !== "service");
  const next = published[(published.findIndex(p => p.id === project.id) + 1) % published.length];
  const contact = whatsapp(ru ? `Здравствуйте! Мне интересен проект ${project.shortTitle.ru}. Хочу обсудить похожие работы для своего объекта.` : `Hello! I am interested in ${project.shortTitle.en}. I would like to discuss similar work for my property.`);
  const progress = project.status === "progress";
  const status = progress ? (ru ? "В процессе" : "In progress") : (ru ? "Завершён" : "Completed");
  const cover = project.cover ?? project.images[0];
  useEffect(() => {
    if (!lightbox) return;
    const move = (event: KeyboardEvent) => {
      if (!["ArrowLeft","ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const index = photos.indexOf(lightbox);
      setLightbox(photos[(index + (event.key === "ArrowRight" ? 1 : -1) + photos.length) % photos.length]);
    };
    window.addEventListener("keydown", move);
    return () => window.removeEventListener("keydown", move);
  }, [lightbox, photos]);

  return <main id="content" className="project-detail-page">
    <header className="detail-header">
      <Link className="logo" href={pathFor(lang)}><Image src="/space-buro-logo.png" alt="Space Buro" width={104} height={65} priority /></Link>
      <Link href={`${pathFor(lang)}#projects`}>← {ru ? "Все проекты" : "All projects"}</Link>
      <div><Link href={projectPath(ru?"en":"ru",project)} hrefLang={ru?"en":"ru"}>{ru?"EN":"RU"}</Link><a href={contact} target="_blank" rel="noreferrer" aria-label="WhatsApp">WA</a></div>
    </header>
    <section className="detail-hero">
      <div className="detail-hero-copy">
        <nav className="breadcrumbs" aria-label={ru?"Навигация по страницам":"Breadcrumbs"}><Link href={pathFor(lang)}>{ru?"Главная":"Home"}</Link><span> / </span><Link href={`${pathFor(lang)}#projects`}>{ru?"Проекты":"Projects"}</Link></nav>
        <p className="eyebrow">{project.categories.map(c => categories[lang][c]).join(" · ")}</p>
        <h1>{project.shortTitle[lang]}</h1><p>{project.summary[lang]}</p>
        <span className={`status-badge ${project.status}`}>{status} · {project.year}</span>
        <a className="button button-primary" href={contact} target="_blank" rel="noreferrer">{ru?"Обсудить похожий проект":"Discuss a similar project"}<span>↗</span></a>
      </div>
      <div className="detail-hero-image"><Image src={cover} alt={`${project.shortTitle[lang]} — ${caption(cover)}`} fill sizes="(max-width: 900px) 100vw, 58vw" priority /><small>{caption(cover)}</small></div>
    </section>
    <section className="detail-facts">
      <div><p className="eyebrow">{ru?"Задача клиента":"The brief"}</p><h2>{ru?"О проекте":"About the project"}</h2><p className="case-brief">{projectBriefs[project.id]?.[lang] ?? project.summary[lang]}</p></div>
      <dl>
        <div><dt>{ru?"Площадь":"Area"}</dt><dd>{project.area[lang]}</dd></div>
        <div><dt>{progress ? (ru?"Плановый срок":"Planned duration") : (ru?"Срок":"Duration")}</dt><dd>{project.duration[lang]}</dd></div>
        <div><dt>{ru?"Год":"Year"}</dt><dd>{project.year}</dd></div>
        <div><dt>{ru?"Расположение":"Location"}</dt><dd>{project.district}</dd></div>
      </dl>
      <div className="detail-scope"><h3>{progress ? (ru?"Состав проекта":"Project scope") : (ru?"Что сделали":"Our work")}</h3><ol>{project.scope.map((item,i) => <li key={item.en}><span>{String(i+1).padStart(2,"0")}</span>{item[lang]}</li>)}</ol>{project.materials?.length ? <div className="detail-materials"><span>{ru?"Материалы и комплектующие":"Materials and hardware"}</span><div>{project.materials.map(m=><strong key={m}>{m}</strong>)}</div></div>:null}
        <div className="case-outcome"><h3>{progress ? (ru?"Статус проекта":"Project status") : (ru?"Результат":"The result")}</h3><p>{progress ? (ru?"Проект в процессе реализации. Галерея показывает опубликованные проектные решения и фотографии состояния объекта; завершённые работы пока не представлены.":"The project is in progress. The gallery contains published design proposals and site photographs; completed work is not yet presented.") : (ru?`Работы завершены в ${project.year} году. В галерее — выполненная отделка и/или установленная мебель согласно составу проекта.`:`The project was completed in ${project.year}. The gallery shows the finished interiors and/or installed furniture within the stated scope.`)}</p></div>
      </div>
    </section>
    <section className="detail-gallery" id="gallery">
      <div className="detail-section-title"><p className="eyebrow">{photos.length} {ru?"фото":"images"}</p><h2>{ru?"Проект в деталях":"Project in detail"}</h2></div>
      <div className="filter-bar" aria-label={ru?"Этапы проекта":"Project stages"}>
        {primary.length > 0 && <button type="button" aria-pressed={gallery==="primary"} className={gallery==="primary"?"active":""} onClick={()=>{setGallery("primary");setExpanded(false);}}>{primaryLabel} · {primary.length}</button>}
        {before.length > 0 && <button type="button" aria-pressed={gallery==="before"} className={gallery==="before"?"active":""} onClick={()=>{setGallery("before");setExpanded(false);}}>{beforeLabel} · {before.length}</button>}
        {primary.length > 0 && before.length > 0 && <button type="button" aria-pressed={gallery==="all"} className={gallery==="all"?"active":""} onClick={()=>{setGallery("all");setExpanded(false);}}>{ru?"Все фотографии":"All photos"}</button>}
      </div>
      <div className="detail-gallery-grid">{visiblePhotos.map((src,i)=><button key={src} type="button" className={i===0?"large":""} aria-label={`${ru?"Открыть":"Open"}: ${caption(src)}, ${i+1}`} onClick={()=>setLightbox(src)}><Image src={src} alt={`${project.shortTitle[lang]}, ${project.district} — ${caption(src)}, ${i+1}`} fill sizes="(max-width: 620px) 100vw, 50vw" /><span>{caption(src)} · {i+1}</span></button>)}</div>
      {photos.length>12 && <button className="expand-button" type="button" aria-expanded={expanded} onClick={()=>setExpanded(!expanded)}>{expanded?(ru?"Свернуть":"Show fewer"):(ru?`Показать все ${photos.length} фото`:`Show all ${photos.length} photos`)}</button>}
    </section>
    <section className="detail-team"><div className="detail-section-title"><p className="eyebrow">{ru?"Команда Space Buro":"Space Buro team"}</p><h2>{ru?"Участники проекта":"Project team"}</h2></div><div>{participants.map(member=><Link href={`${pathFor(lang)}#team-${member.id}`} key={member.id}><div><Image src={member.image} alt={member.name[lang]} fill sizes="160px" /></div><span><strong>{member.name[lang]}</strong><small>{member.role[lang]}</small></span><b>↗</b></Link>)}</div></section>
    <section className="detail-next"><a className="button button-primary" href={contact} target="_blank" rel="noreferrer">{ru?"Обсудить похожий проект":"Discuss a similar project"}<span>↗</span></a><Link href={projectPath(lang,next)}><span>{ru?"Следующий проект":"Next project"}</span><strong>{next.shortTitle[lang]}</strong><b>→</b></Link></section>
    <a className="floating-contact" href={contact} target="_blank" rel="noreferrer">WhatsApp · {ru?"Обсудить проект":"Discuss a project"}</a>
    {lightbox && <section ref={dialogRef} className="detail-lightbox" role="dialog" aria-modal="true" aria-label={`${project.shortTitle[lang]} — ${caption(lightbox)}`} onClick={event=>{if(event.target===event.currentTarget)close();}}><button type="button" onClick={close} aria-label={ru?"Закрыть фотографию":"Close photo"}>×</button><Image src={lightbox} alt={`${project.shortTitle[lang]} — ${caption(lightbox)}`} fill sizes="100vw" /><p>{caption(lightbox)} · {photos.indexOf(lightbox)+1} / {photos.length}</p><div className="lightbox-nav"><button type="button" aria-label={ru?"Предыдущее фото":"Previous photo"} onClick={()=>setLightbox(photos[(photos.indexOf(lightbox)-1+photos.length)%photos.length])}>←</button><button type="button" aria-label={ru?"Следующее фото":"Next photo"} onClick={()=>setLightbox(photos[(photos.indexOf(lightbox)+1)%photos.length])}>→</button></div></section>}
  </main>;
}
