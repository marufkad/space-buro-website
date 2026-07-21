"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { projectLocations, team, type Lang, type ProjectCategory, type ProjectLocation } from "../../data";

const labels: Record<Lang, {
  back: string; menu: string; facts: string; area: string; duration: string; year: string; location: string; scope: string;
  gallery: string; noGallery: string; before: string; beforeEmpty: string; people: string; peopleText: string; files: string;
  publicGallery: string; publicGalleryState: string; techFiles: string; techState: string; contact: string; next: string;
  categories: Record<ProjectCategory, string>; concept: string; materials: string; secondaryGallery: string;
}> = {
  ru: {
    back: "Все проекты", menu: "Главная", facts: "Факты объекта", area: "Площадь", duration: "Срок", year: "Год", location: "География", scope: "Состав работ",
    gallery: "Фотографии объекта", noGallery: "Фотографии для этой карточки ещё готовятся. Структура страницы уже готова для загрузки изображений.", before: "До начала работ", beforeEmpty: "Фотографии состояния «до» пока не опубликованы. Их можно добавить сюда без изменения страницы.", people: "Кто участвовал", peopleText: "Нажмите на сотрудника, чтобы перейти к его профилю и другим объектам.", files: "Файлы объекта",
    publicGallery: "Оптимизированная WebP-галерея", publicGalleryState: "Доступна", techFiles: "Рабочие чертежи, сметы и акты", techState: "По запросу / сотрудникам", contact: "Обсудить похожий проект", next: "Следующий объект",
    categories: { renovation: "Реновация", furniture: "Мебель", residential: "Жильё", commercial: "Коммерция", architecture: "Архитектура", china: "Мебель из Китая" }, concept: "Визуальная концепция услуги, не реализованный объект", materials: "Материалы и комплектующие", secondaryGallery: "Дополнительная галерея",
  },
  en: {
    back: "All projects", menu: "Home", facts: "Project facts", area: "Area", duration: "Duration", year: "Year", location: "Location", scope: "Scope of work",
    gallery: "Project photography", noGallery: "Photography for this profile is still in preparation. The page is ready for images to be uploaded.", before: "Before work started", beforeEmpty: "Before photography has not been published yet. It can be added here without changing the page.", people: "People involved", peopleText: "Select a team member to see their profile and other project participation.", files: "Project files",
    publicGallery: "Optimised WebP gallery", publicGalleryState: "Available", techFiles: "Drawings, estimates and reports", techState: "On request / employees", contact: "Discuss a similar project", next: "Next project",
    categories: { renovation: "Renovation", furniture: "Furniture", residential: "Residential", commercial: "Commercial", architecture: "Architecture", china: "Furniture from China" }, concept: "Service concept visual, not a completed project", materials: "Materials and hardware", secondaryGallery: "Additional gallery",
  },
};

export default function ProjectDetail({ project }: { project: ProjectLocation }) {
  const [lang, setLang] = useState<Lang>("ru");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const t = labels[lang];
  const participants = team.filter((member) => project.teamIds.includes(member.id));
  const publishedProjects = projectLocations.filter((item) => item.published);
  const currentIndex = publishedProjects.findIndex((item) => item.id === project.id);
  const nextProject = publishedProjects[(currentIndex + 1) % publishedProjects.length];

  return (
    <main className="project-detail-page">
      <header className="detail-header">
        <Link className="logo" href="/"><Image src="/space-buro-logo.png" alt="Space Buro" width={104} height={65} priority /></Link>
        <Link href="/#projects">← {t.back}</Link>
        <div><button type="button" onClick={() => setLang(lang === "ru" ? "en" : "ru")}>{lang === "ru" ? "EN" : "RU"}</button><a href="https://wa.me/971523569697" target="_blank" rel="noreferrer">WA</a><a href="https://t.me/marufkad" target="_blank" rel="noreferrer">TG</a></div>
      </header>

      <section className="detail-hero">
        <div className="detail-hero-copy">
          <p className="eyebrow">{project.categories.map((category) => t.categories[category]).join(" · ")} · {project.year}</p>
          <h1>{project.title[lang]}</h1>
          <p>{project.summary[lang]}</p>
        </div>
        <div className="detail-hero-image">
          {project.cover ?? project.images[0] ? <Image src={project.cover ?? project.images[0]} alt={project.title[lang]} fill sizes="(max-width: 900px) 100vw, 58vw" priority /> : <div className={`project-placeholder ${project.category}`}><span>{project.district.slice(0, 2).toUpperCase()}</span><i /><small>{t.noGallery}</small></div>}
        </div>
      </section>

      <section className="detail-facts">
        <div><p className="eyebrow">{t.facts}</p><h2>{project.shortTitle[lang]}</h2></div>
        <dl>
          <div><dt>{t.area}</dt><dd>{project.area[lang]}</dd></div>
          <div><dt>{t.duration}</dt><dd>{project.duration[lang]}</dd></div>
          <div><dt>{t.year}</dt><dd>{project.year}</dd></div>
          <div><dt>{t.location}</dt><dd>{project.district}</dd></div>
        </dl>
        <div className="detail-scope"><h3>{t.scope}</h3><ol>{project.scope.map((item, index) => <li key={item.en}><span>{String(index + 1).padStart(2, "0")}</span>{item[lang]}</li>)}</ol>{project.materials?.length ? <div className="detail-materials"><span>{t.materials}</span><div>{project.materials.map((material) => <strong key={material}>{material}</strong>)}</div></div> : null}</div>
      </section>

      <section className="detail-gallery">
        <div className="detail-section-title"><p className="eyebrow">{String(project.images.length).padStart(2, "0")} images</p><h2>{t.gallery}</h2></div>
        {project.images.length > 0 ? <div className="detail-gallery-grid">{project.images.map((image, index) => <button key={image} type="button" className={index === 0 ? "large" : ""} onClick={() => setLightbox(image)}><Image src={image} alt={`${project.title[lang]} — ${index + 1}`} fill sizes={index === 0 ? "100vw" : "50vw"} /><span>{String(index + 1).padStart(2, "0")}</span></button>)}</div> : <div className="empty-gallery"><span>{project.district.slice(0, 2).toUpperCase()}</span><p>{t.noGallery}</p></div>}
      </section>

      {!project.categories.includes("china") && <section className="detail-before">
        <div><p className="eyebrow">{t.secondaryGallery}{project.beforeImages?.length ? ` · ${String(project.beforeImages.length).padStart(2, "0")}` : ""}</p><h2>{project.beforeLabel?.[lang] ?? t.before}</h2></div>
        {project.beforeImages?.length ? <div className="detail-before-grid">{project.beforeImages.map((image, index) => <button key={image} type="button" onClick={() => setLightbox(image)}><Image src={image} alt={`${project.title[lang]} — ${t.before} ${index + 1}`} fill sizes="(max-width: 620px) 100vw, 36vw" /><span>{String(index + 1).padStart(2, "0")}</span></button>)}</div> : <article><span>+</span><p>{t.beforeEmpty}</p></article>}
      </section>}

      <section className="detail-team">
        <div className="detail-section-title"><p className="eyebrow">Space Buro team</p><h2>{t.people}</h2><p>{t.peopleText}</p></div>
        <div>{participants.map((member) => <Link href={`/#team-${member.id}`} key={member.id}><div><Image src={member.image} alt={member.name[lang]} fill sizes="160px" /></div><span><strong>{member.name[lang]}</strong><small>{member.role[lang]}</small></span><b>↗</b></Link>)}</div>
      </section>

      <section className="detail-files">
        <div><p className="eyebrow">Documentation</p><h2>{t.files}</h2></div>
        <article><span>IMG</span><div><strong>{t.publicGallery}</strong><small>{project.images.length} WebP</small></div><b>{project.images.length ? t.publicGalleryState : "—"}</b></article>
        <article><span>LOCK</span><div><strong>{t.techFiles}</strong><small>{t.techState}</small></div><b>Private</b></article>
      </section>

      <section className="detail-next">
        <a className="button button-primary" href="https://wa.me/971523569697" target="_blank" rel="noreferrer">{t.contact}<span>↗</span></a>
        <Link href={`/projects/${nextProject.id}`}><span>{t.next}</span><strong>{nextProject.shortTitle[lang]}</strong><b>→</b></Link>
      </section>

      {lightbox && <div className="detail-lightbox" role="dialog" aria-modal="true"><button type="button" onClick={() => setLightbox(null)}>×</button><Image src={lightbox} alt={project.title[lang]} fill sizes="100vw" /></div>}
    </main>
  );
}
