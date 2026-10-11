import Image from "next/image";
import Link from "next/link";
import { projectLocations, type Lang, type Localized, type ProjectLocation } from "./data";
import { pathFor, projectPath, whatsapp } from "./site";
import CaseGallery, { type CasePhoto } from "./CaseGallery";
import LabTeam from "./LabTeam";
import { casePresentations, projectBriefs } from "./caseStudies";
import media from "./project-media.json";
import "./case-study.css";

type CaseStudyMedia = {
  photos: CasePhoto[];
  groups: Array<{ id: string; label: Localized }>;
  hero: CasePhoto;
};

const projectMedia: Record<string, CaseStudyMedia> = media;

function galleryNote(project: ProjectLocation, lang: Lang) {
  const ru = lang === "ru";
  if (project.id === "al-furjan-villa") return ru
    ? "Светлые поверхности, древесные текстуры и встроенная подсветка объединяют комнаты. В галерее — завершённый интерьер."
    : "Light surfaces, wood textures and integrated lighting connect the rooms. The gallery shows the completed interior.";
  if (project.id === "sadaf-8-jbr") return ru
    ? "Проект в процессе. В галерее — фотографии состояния квартиры до завершения мебельных работ."
    : "The project is in progress. The gallery shows the apartment before the furniture work is completed.";
  if (project.status === "progress") return project.categories.includes("architecture")
    ? (ru ? "Проект в процессе. В галерее отдельно показаны архитектурные визуализации и фотографии хода работ." : "The project is in progress. Architectural visualisations and site progress photographs are shown separately in the gallery.")
    : (ru ? "Проект в процессе. В галерее — дизайн-визуализации и фотографии до ремонта; завершённый интерьер пока не представлен." : "The project is in progress. The gallery contains design visualisations and photographs before renovation; the completed interior is not yet shown.");
  return project.beforeImages?.length
    ? (ru ? "В галерее — реализованные решения и отдельный раздел с фотографиями до начала работ." : "The gallery shows the completed work, with a separate section for photographs taken before the works.")
    : (ru ? "В галерее — завершённый проект и детали установленной мебели." : "The gallery shows the completed project and details of the installed furniture.");
}

function Arrow({ direction = "right" }: { direction?: "left" | "right" | "down" }) {
  return <svg className={`case-arrow is-${direction}`} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function ProjectCaseStudy({ project, lang }: { project: ProjectLocation; lang: Lang }) {
  const ru = lang === "ru";
  const presentation = casePresentations[project.id];
  const { photos, groups, hero } = projectMedia[project.id];
  const furjan = project.id === "al-furjan-villa";
  const progress = project.status === "progress";
  const title = presentation?.title ?? project.shortTitle[lang];
  const status = progress ? (ru ? "В процессе" : "In progress") : (ru ? "Завершён" : "Completed");
  const coverLabel = hero.group.startsWith("design") ? (ru ? "Визуализация проекта" : "Design visualisation")
    : hero.group === "before" ? (ru ? "До начала работ" : "Before works")
    : progress ? (ru ? "Состояние объекта · В процессе" : "Site condition · In progress")
    : (ru ? "Реализованный интерьер" : "Completed interior");
  const contact = whatsapp(furjan
    ? (ru ? "Здравствуйте! Мне понравилась вилла Al Furjan. Хочу обсудить ремонт и мебель для своего объекта."
      : "Hello! I liked your Al Furjan Villa project. I would like to discuss renovation and furniture for my property.")
    : (ru ? `Здравствуйте! Мне интересен проект ${project.shortTitle.ru}. Хочу обсудить похожие работы для своего объекта.`
      : `Hello! I am interested in ${project.shortTitle.en}. I would like to discuss similar work for my property.`));
  const brief = furjan
    ? (ru ? "Полный ремонт и меблировка виллы в Al Furjan: дизайн, инженерные работы, отделка и мебель в одном проекте."
      : "A complete renovation and furnishing of a villa in Al Furjan, bringing design, engineering, finishes and furniture into one project.")
    : (projectBriefs[project.id]?.[lang] ?? project.summary[lang]);
  const invitation = furjan
    ? (ru ? "Планируете ремонт и мебель для виллы? Расскажите о своём объекте — обсудим задачи, объём работ и следующие шаги."
      : "Planning a villa renovation and furniture? Tell us about your property so we can discuss the brief, scope and next steps.")
    : project.categories.includes("architecture")
      ? (ru ? "Планируете архитектурные или строительные работы? Расскажите о своём объекте — обсудим задачи, объём работ и следующие шаги."
        : "Planning architectural or construction work? Tell us about your property so we can discuss the brief, scope and next steps.")
      : (ru ? "Планируете обновить пространство или заказать мебель? Расскажите о своём объекте — обсудим задачи, объём работ и следующие шаги."
        : "Planning to update a space or commission furniture? Tell us about your property so we can discuss the brief, scope and next steps.");
  const otherProjects = projectLocations.filter(item => item.published && item.status !== "service");
  const next = otherProjects[(otherProjects.findIndex(item => item.id === project.id) + 1) % otherProjects.length];

  return <main id="content" className="case-study">
    <header className="case-header">
      <Link className="case-logo" href={pathFor(lang)} aria-label={ru ? "Space Buro — главная" : "Space Buro — home"}><Image src="/space-buro-logo.png" alt="Space Buro" width={104} height={65} priority /></Link>
      <Link className="case-back" href={`${pathFor(lang)}#projects`}><Arrow direction="left" /><span>{ru ? "Все проекты" : "All projects"}</span></Link>
      <nav className="case-desktop-nav" aria-label={ru ? "Разделы проекта" : "Project sections"}>
        <a href="#case-about">{ru ? "О проекте" : "Overview"}</a>
        <a href="#case-gallery">{ru ? "Фотографии" : "Gallery"}</a>
        <a href="#case-team">{ru ? "Команда" : "Team"}</a>
      </nav>
      <div className="case-header-actions">
        <Link className="case-language" href={projectPath(ru ? "en" : "ru", project)} hrefLang={ru ? "en" : "ru"} aria-label={ru ? "Read in English" : "Читать на русском"}>{ru ? "EN" : "RU"}</Link>
        <a className="case-header-contact" href={contact} target="_blank" rel="noreferrer">{ru ? "Обсудить проект" : "Let’s talk"}<Arrow /></a>
      </div>
    </header>

    <section className="case-hero" aria-labelledby="case-title">
      <div className={`case-hero-heading${title.length > 12 ? " is-long-title" : ""}`}>
        <div>
          <p className="case-kicker">{presentation?.category[lang] ?? project.title[lang]}</p>
          <h1 id="case-title">{title}<span>{presentation?.subtitle[lang] ?? project.district}</span></h1>
        </div>
        <div className="case-hero-intro">
          <p>{project.summary[lang]}</p>
          <a className="case-text-link" href="#case-gallery">{ru ? "Смотреть фотографии" : "Explore the photographs"}<Arrow direction="down" /></a>
        </div>
      </div>
      <figure className="case-cover">
        <Image src={hero.src} alt={hero.alt[lang]} width={hero.width} height={hero.height} sizes="(max-width: 700px) 100vw, 96vw" priority />
        <figcaption><span>{project.district}</span><span>{coverLabel}</span></figcaption>
      </figure>
    </section>

    <section className="case-overview case-section" id="case-about" aria-labelledby="case-about-title">
      <div className="case-section-heading" data-reveal>
        <p className="case-kicker">01 / {ru ? "О проекте" : "The project"}</p>
        <h2 id="case-about-title">{presentation?.heading[lang] ?? (ru ? "О проекте." : "About the project.")}</h2>
        <dl className="case-facts" aria-label={ru ? "Проект в цифрах" : "Project facts"}>
          <div><dt>{ru ? "Площадь" : "Area"}</dt><dd>{project.area[lang]}</dd></div>
          <div><dt>{progress ? (ru ? "Плановый срок" : "Planned duration") : (ru ? "Срок реализации" : "Project duration")}</dt><dd>{project.duration[lang]}</dd></div>
          <div><dt>{ru ? "Год" : "Year"}</dt><dd>{project.year}</dd></div>
          <div><dt>{ru ? "Статус" : "Status"}</dt><dd className="case-status"><i aria-hidden="true" />{status}</dd></div>
        </dl>
      </div>
      <div className="case-overview-content">
        <div className="case-brief" data-reveal>
          <p>{brief}</p>
          <p>{galleryNote(project, lang)}</p>
          <a className="case-text-link" href={`https://www.openstreetmap.org/?mlat=${project.lat}&mlon=${project.lng}#map=15/${project.lat}/${project.lng}`} target="_blank" rel="noreferrer">{project.district} <span className="case-map-label">{ru ? "На карте" : "View map"}</span><Arrow /></a>
        </div>
        <div className="case-scope" data-reveal>
          <h3>{progress ? (ru ? "Состав проекта" : "Project scope") : (ru ? "Что сделала наша команда" : "Our scope of work")}</h3>
          <ol>{project.scope.map((item, index) => <li key={item.en}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h4>{item[lang]}</h4></li>)}</ol>
          {Boolean(project.materials?.length) && <div className="case-materials"><h3>{ru ? "Материалы и комплектующие" : "Materials and hardware"}</h3><ul>{project.materials?.map(material => <li key={material}>{material}</li>)}</ul></div>}
        </div>
      </div>
    </section>

    <CaseGallery photos={photos} groups={groups} lang={lang} projectTitle={project.shortTitle[lang]} />

    <LabTeam lang={lang} project={project} />

    <section className="case-contact case-section" aria-labelledby="case-contact-title">
      <div data-reveal><p className="case-kicker">{ru ? "Ваш следующий проект" : "Your next project"}</p><h2 id="case-contact-title">{ru ? "Теперь — ваше пространство." : "Next, your space."}</h2></div>
      <div data-reveal><p>{invitation}</p><a className="case-contact-button" href={contact} target="_blank" rel="noreferrer">{ru ? "Обсудить в WhatsApp" : "Discuss on WhatsApp"}<Arrow /></a></div>
    </section>

    <section className="case-next case-section" aria-label={ru ? "Другие проекты" : "More projects"}>
      <div data-reveal><p className="case-kicker">{ru ? "Продолжить знакомство" : "Keep exploring"}</p><h2>{ru ? "Другой объект. Тот же подход." : "Another space. The same care."}</h2><Link className="case-text-link" href={`${pathFor(lang)}#projects`}>{ru ? "Все проекты Space Buro" : "All Space Buro projects"}<Arrow /></Link></div>
      <Link className="case-next-card" href={projectPath(lang, next)} data-reveal><div><Image src={next.cover ?? next.images[0]} alt={next.shortTitle[lang]} fill sizes="(max-width: 700px) 90vw, 48vw" /></div><span><span><small>{ru ? "Следующий проект" : "Next project"}</small><strong>{next.shortTitle[lang]}</strong></span><Arrow /></span></Link>
    </section>

    <footer className="case-footer"><Link href={pathFor(lang)} aria-label={ru ? "Space Buro — главная" : "Space Buro — home"}>Space Buro</Link><span>{ru ? "Архитектура · Ремонт · Мебель" : "Architecture · Fit-out · Furniture"}</span><Link href={pathFor(lang, "/privacy")}>{ru ? "Конфиденциальность" : "Privacy"}</Link></footer>
    <a className="case-mobile-contact" href={contact} target="_blank" rel="noreferrer">{ru ? "Обсудить свой проект" : "Discuss your project"}<span>WhatsApp</span><Arrow /></a>
  </main>;
}
