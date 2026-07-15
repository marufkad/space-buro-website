"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, PointerEvent, useEffect, useMemo, useState } from "react";
import {
  brands,
  developers,
  projectLocations,
  stages,
  team,
  type Lang,
  type ProjectCategory,
  type ProjectLocation,
} from "./data";

const ProjectMap = dynamic(() => import("./ProjectMap"), {
  ssr: false,
  loading: () => <div className="map-loading">Loading project map…</div>,
});

type Filter = "all" | ProjectCategory;
type CalculatorType = "renovation" | "furniture" | "china";

const filterOrder: Filter[] = ["all", "fitout", "furniture", "china", "commercial"];

const categoryLabels: Record<Lang, Record<ProjectCategory, string>> = {
  ru: { fitout: "Fit-out", furniture: "Мебель", china: "Мебель из Китая", commercial: "Коммерческие" },
  en: { fitout: "Fit-out", furniture: "Furniture", china: "Furniture from China", commercial: "Commercial" },
};

const heroSlides = [
  {
    image: "/hero-room.webp",
    title: { ru: "Интерьер под ключ — от идеи до готового пространства", en: "Turnkey interiors — from idea to completed space" },
    text: { ru: "Дизайн, согласования, ремонт и мебель в одной ответственной команде.", en: "Design, approvals, fit-out and furniture under one accountable team." },
    tag: { ru: "Ремонт · Fit-out · Мебель", en: "Renovation · Fit-out · Furniture" },
  },
  {
    image: "/media/project-fujairah-01.webp",
    title: { ru: "Показываем не только кадры, но и факты проекта", en: "More than imagery: every project comes with facts" },
    text: { ru: "Площадь, сроки, состав работ, команда и география — в одной карточке объекта.", en: "Area, timing, scope, team and geography — connected in one project profile." },
    tag: { ru: "Библиотека объектов", en: "Project library" },
  },
  {
    image: "/media/china-furniture-concept.webp",
    title: { ru: "Мебель из Китая с контролем от фабрики до Дубая", en: "Furniture from China, controlled from factory to Dubai" },
    text: { ru: "Подбор фабрик, образцы, контроль качества, консолидация и доставка.", en: "Factory sourcing, samples, quality control, consolidation and delivery." },
    tag: { ru: "Dubai · Foshan", en: "Dubai · Foshan" },
  },
] as const;

const ui = {
  ru: {
    nav: [["Объекты", "#projects"], ["Карта", "#map"], ["Китай", "#china"], ["Этапы", "#process"], ["Калькулятор", "#calculator"], ["Команда", "#team"]],
    heroPrimary: "Смотреть объекты",
    heroSecondary: "Рассчитать проект",
    slide: "Слайд",
    proof: [["10+", "лет опыта команды"], ["01", "команда на весь проект"], ["UAE", "объекты на карте"], ["RU / EN", "коммуникация"]],
    advantagesKicker: "Почему Space Buro",
    advantagesTitle: "Снимаем риски, которые обычно остаются между подрядчиками",
    advantages: [
      ["01", "Собственное производство мебели", "Ремонт и корпусная мебель синхронизированы по чертежам и срокам."],
      ["02", "Русскоязычная команда", "Обсуждаем сложные технические вопросы без потери смысла; работаем также на английском."],
      ["03", "Согласования и NOC", "Координируем building management, необходимые разрешения и доступ на объект."],
      ["04", "Прозрачная смета", "Разделяем работы, материалы и изменения, чтобы бюджет оставался управляемым."],
      ["05", "Еженедельный фотоотчёт", "Показываем прогресс, следующие работы и вопросы, требующие решения."],
      ["06", "Гарантия и aftercare", "Закрываем замечания после передачи и остаёмся на связи по гарантии."],
    ],
    projectsKicker: "Библиотека объектов",
    projectsTitle: "Проекты связаны с картой, файлами и командой",
    projectsText: "Фильтры действительно меняют подборку. Откройте карточку, чтобы увидеть факты, фотографии, состав работ и участников.",
    filters: { all: "Все", fitout: "Fit-out", furniture: "Мебель", china: "Мебель из Китая", commercial: "Коммерческие" },
    noPhotos: "Фотографии готовятся",
    openProject: "Открыть объект",
    completed: "Завершён",
    progress: "В работе",
    service: "Услуга",
    brandsKicker: "Материалы и комплектующие, с которыми работаем",
    mapKicker: "География проектов",
    mapTitle: "Выберите категорию, затем объект на карте ОАЭ",
    mapText: "Иконка показывает тип объекта. Точный номер квартиры или виллы не публикуется.",
    mapOpen: "Страница объекта",
    chinaKicker: "Новая услуга",
    chinaTitle: "Заказ мебели из Китая",
    chinaText: "Мы превращаем поездку по шоурумам и фабрикам в управляемый процесс: от ведомости мебели до доставки и установки в ОАЭ.",
    chinaSteps: [["01", "Комплектация", "Собираем ведомость, размеры, стиль и бюджет."], ["02", "Фабрики и образцы", "Сравниваем предложения и проверяем материалы."], ["03", "Контроль", "Сверяем производство с утверждённой спецификацией."], ["04", "Логистика", "Консолидируем, доставляем и координируем монтаж."]],
    concept: "Визуальная концепция услуги, не реализованный объект",
    chinaCta: "Обсудить комплектацию",
    processKicker: "Этапы работы",
    processTitle: "Наведите на номер — получите результат этапа",
    processText: "На телефоне нажмите на номер. Активный этап раскрывается ниже и показывает, что именно вы получаете.",
    stage: "Этап",
    result: "Результат",
    developersKicker: "Девелоперы Дубая",
    developersTitle: "Работаем с объектами ведущих застройщиков",
    developersText: "Знаем, что требования к доступу, NOC и проведению работ различаются в каждом здании и community. Названия ниже обозначают объекты девелоперов, а не официальное партнёрство.",
    calculatorKicker: "Предварительный калькулятор",
    calculatorTitle: "Получите ориентир бюджета за одну минуту",
    calculatorText: "Это диапазон для планирования, не коммерческое предложение. Точная смета появляется после замера и согласования состава работ.",
    calcTabs: { renovation: "Ремонт", furniture: "Мебель", china: "Мебель из Китая" },
    area: "Площадь помещения",
    level: "Уровень ремонта",
    levels: { cosmetic: "Косметический", standard: "Полный", premium: "Премиальный" },
    meters: "Погонные метры мебели",
    rooms: "Количество комнат",
    estimate: "Ориентировочный диапазон",
    estimateNote: "Без учёта VAT, согласований и индивидуальных позиций. Финальная цена зависит от объекта и спецификации.",
    calcCta: "Уточнить расчёт",
    teamKicker: "Команда",
    teamTitle: "Специалисты и объекты, в которых они участвовали",
    teamText: "Каждый объект связан с участниками. Нажмите на название проекта, чтобы перейти к его фактам и фотографиям.",
    participation: "Участие в проектах",
    contactKicker: "Новый проект",
    contactTitle: "Расскажите, что нужно сделать",
    contactText: "Пришлите план, фотографии или короткое описание. Ответим в WhatsApp или Telegram и предложим следующий шаг.",
    name: "Ваше имя",
    phone: "Номер телефона",
    type: "Тип проекта",
    message: "Коротко о задаче",
    submit: "Отправить в WhatsApp",
    projectTypes: ["Ремонт квартиры", "Ремонт виллы", "Офис / магазин", "Мебель на заказ", "Мебель из Китая"],
  },
  en: {
    nav: [["Projects", "#projects"], ["Map", "#map"], ["China", "#china"], ["Process", "#process"], ["Calculator", "#calculator"], ["Team", "#team"]],
    heroPrimary: "Explore projects",
    heroSecondary: "Estimate a project",
    slide: "Slide",
    proof: [["10+", "years of team experience"], ["01", "team for the full project"], ["UAE", "projects on the map"], ["RU / EN", "communication"]],
    advantagesKicker: "Why Space Buro",
    advantagesTitle: "We remove the risks that usually sit between contractors",
    advantages: [
      ["01", "In-house furniture production", "Fit-out and joinery are coordinated through shared drawings and schedules."],
      ["02", "Russian-speaking team", "Technical decisions remain clear; all project communication is also available in English."],
      ["03", "Approvals and NOCs", "We coordinate building management, permits and site access requirements."],
      ["04", "Transparent estimates", "Works, materials and variations are separated so the budget stays manageable."],
      ["05", "Weekly photo reports", "See progress, next activities and decisions that require your attention."],
      ["06", "Warranty and aftercare", "We close snags after handover and remain available throughout the warranty."],
    ],
    projectsKicker: "Project library",
    projectsTitle: "Projects connected to maps, files and people",
    projectsText: "The filters update the collection. Open any card for facts, photography, scope and the team involved.",
    filters: { all: "All", fitout: "Fit-out", furniture: "Furniture", china: "Furniture from China", commercial: "Commercial" },
    noPhotos: "Photography in preparation",
    openProject: "Open project",
    completed: "Completed",
    progress: "In progress",
    service: "Service",
    brandsKicker: "Materials and components we work with",
    mapKicker: "Project geography",
    mapTitle: "Choose a category, then select a UAE project",
    mapText: "Each icon identifies the project type. Exact unit and villa numbers remain private.",
    mapOpen: "Project page",
    chinaKicker: "New service",
    chinaTitle: "Furniture from China",
    chinaText: "We turn showroom and factory sourcing into a controlled process, from the furniture schedule to UAE delivery and installation.",
    chinaSteps: [["01", "Schedule", "We define items, dimensions, style and budget."], ["02", "Factories and samples", "We compare offers and verify materials."], ["03", "Quality control", "Production is checked against the approved specification."], ["04", "Logistics", "We consolidate, deliver and coordinate installation."]],
    concept: "Service concept visual, not a completed project",
    chinaCta: "Discuss furnishing",
    processKicker: "Our process",
    processTitle: "Hover over a number to see its deliverable",
    processText: "On mobile, tap a number. The selected stage opens below with a clear explanation of what you receive.",
    stage: "Stage",
    result: "Deliverable",
    developersKicker: "Dubai developers",
    developersTitle: "Working in properties by leading developers",
    developersText: "Access, NOC and work requirements vary by building and community. The names below indicate developer properties, not formal partnerships.",
    calculatorKicker: "Preliminary calculator",
    calculatorTitle: "Get a planning range in one minute",
    calculatorText: "This is a budget guide, not a quotation. An accurate estimate follows a site survey and confirmed scope.",
    calcTabs: { renovation: "Renovation", furniture: "Furniture", china: "Furniture from China" },
    area: "Property area",
    level: "Renovation level",
    levels: { cosmetic: "Cosmetic", standard: "Full", premium: "Premium" },
    meters: "Linear metres of furniture",
    rooms: "Number of rooms",
    estimate: "Indicative range",
    estimateNote: "VAT, approvals and individual items are excluded. Final pricing depends on the site and specification.",
    calcCta: "Refine estimate",
    teamKicker: "Team",
    teamTitle: "The specialists connected to each project",
    teamText: "Every project links back to its participants. Select a project name to see its facts and photography.",
    participation: "Project participation",
    contactKicker: "New project",
    contactTitle: "Tell us what you need",
    contactText: "Send a plan, photos or a short summary. We will reply on WhatsApp or Telegram with a practical next step.",
    name: "Your name",
    phone: "Phone number",
    type: "Project type",
    message: "Short project summary",
    submit: "Send via WhatsApp",
    projectTypes: ["Apartment renovation", "Villa renovation", "Office / retail", "Bespoke furniture", "Furniture from China"],
  },
} as const;

function StageIcon({ name }: { name: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "measure") return <svg viewBox="0 0 48 48" aria-hidden="true"><path {...common} d="M8 34 34 8l6 6-26 26H8v-6Z M14 30l4 4m2-10 4 4m2-10 4 4" /></svg>;
  if (name === "design") return <svg viewBox="0 0 48 48" aria-hidden="true"><path {...common} d="M10 38V12h28v26H10Zm0-9h13V12m0 17h15M29 29v9" /><circle {...common} cx="31" cy="20" r="4" /></svg>;
  if (name === "drawings") return <svg viewBox="0 0 48 48" aria-hidden="true"><path {...common} d="M12 8h20l6 6v26H12V8Zm20 0v7h6M18 22h14M18 28h14M18 34h9" /></svg>;
  if (name === "permit") return <svg viewBox="0 0 48 48" aria-hidden="true"><path {...common} d="M14 7h20v34H14V7Zm6 8h8m-8 7h8m-8 7 3 3 6-7" /></svg>;
  if (name === "build") return <svg viewBox="0 0 48 48" aria-hidden="true"><path {...common} d="m10 38 12-12m7-15 8 8-9 9-8-8 9-9ZM8 40l-1-6 5 5-4 1Zm23-12 9 9" /></svg>;
  if (name === "furniture") return <svg viewBox="0 0 48 48" aria-hidden="true"><path {...common} d="M9 24h30v14H9V24Zm4 0v-8h22v8M14 38v4m20-4v4M20 16v8" /></svg>;
  if (name === "handover") return <svg viewBox="0 0 48 48" aria-hidden="true"><path {...common} d="M8 25h13l5 5 14-14M11 25v12h26V21" /></svg>;
  return <svg viewBox="0 0 48 48" aria-hidden="true"><path {...common} d="M10 14h28v24H10V14Zm8 0v-4h12v4M10 23h28M21 27h6" /></svg>;
}

function ProjectVisual({ project, lang, priority = false }: { project: ProjectLocation; lang: Lang; priority?: boolean }) {
  if (project.cover) {
    return <Image src={project.cover} alt={project.title[lang]} fill sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw" priority={priority} />;
  }
  return (
    <div className={`project-placeholder ${project.category}`} aria-label={ui[lang].noPhotos}>
      <span>{project.district.slice(0, 2).toUpperCase()}</span>
      <i />
      <small>{ui[lang].noPhotos}</small>
    </div>
  );
}

function formatAed(value: number, lang: Lang) {
  return new Intl.NumberFormat(lang === "ru" ? "ru-RU" : "en-AE", { maximumFractionDigits: 0 }).format(Math.round(value / 1000) * 1000);
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("ru");
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroSlide, setHeroSlide] = useState(0);
  const [projectFilter, setProjectFilter] = useState<Filter>("all");
  const [mapFilter, setMapFilter] = useState<Filter>("all");
  const [selectedProject, setSelectedProject] = useState(projectLocations[0].id);
  const [activeStage, setActiveStage] = useState(0);
  const [calculatorType, setCalculatorType] = useState<CalculatorType>("renovation");
  const [area, setArea] = useState(100);
  const [renovationLevel, setRenovationLevel] = useState<"cosmetic" | "standard" | "premium">("standard");
  const [furnitureMeters, setFurnitureMeters] = useState(12);
  const [rooms, setRooms] = useState(3);
  const t = ui[lang];

  useEffect(() => {
    const timer = window.setInterval(() => setHeroSlide((current) => (current + 1) % heroSlides.length), 6200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.1 },
    );
    document.querySelectorAll("[data-reveal]").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const filteredProjects = useMemo(
    () => projectLocations.filter((project) => projectFilter === "all" || project.category === projectFilter),
    [projectFilter],
  );
  const mapProjects = useMemo(
    () => projectLocations.filter((project) => mapFilter === "all" || project.category === mapFilter),
    [mapFilter],
  );
  const selected = mapProjects.find((project) => project.id === selectedProject) ?? mapProjects[0];

  const estimate = useMemo(() => {
    if (calculatorType === "furniture") return [furnitureMeters * 1800, furnitureMeters * 3300];
    if (calculatorType === "china") return [rooms * 22000, rooms * 38000];
    const rates = { cosmetic: [350, 550], standard: [850, 1250], premium: [1500, 2300] } as const;
    return [area * rates[renovationLevel][0], area * rates[renovationLevel][1]];
  }, [area, calculatorType, furnitureMeters, renovationLevel, rooms]);

  function chooseMapFilter(value: Filter) {
    setMapFilter(value);
    const first = projectLocations.find((project) => value === "all" || project.category === value);
    if (first) setSelectedProject(first.id);
  }

  function handleHeroPointer(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--px", `${((event.clientX - rect.left) / rect.width - 0.5) * 12}px`);
    event.currentTarget.style.setProperty("--py", `${((event.clientY - rect.top) / rect.height - 0.5) * 12}px`);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = lang === "ru"
      ? `Здравствуйте! Меня зовут ${data.get("name")}. Тип проекта: ${data.get("type")}. Телефон: ${data.get("phone")}. ${data.get("message") || ""}`
      : `Hello! My name is ${data.get("name")}. Project type: ${data.get("type")}. Phone: ${data.get("phone")}. ${data.get("message") || ""}`;
    window.open(`https://wa.me/971523569697?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  function contactEstimate() {
    const message = lang === "ru"
      ? `Здравствуйте! Хочу уточнить предварительный расчёт: ${t.calcTabs[calculatorType]}, AED ${formatAed(estimate[0], lang)}–${formatAed(estimate[1], lang)}.`
      : `Hello! I would like to refine this preliminary estimate: ${t.calcTabs[calculatorType]}, AED ${formatAed(estimate[0], lang)}–${formatAed(estimate[1], lang)}.`;
    window.open(`https://wa.me/971523569697?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <main id="top">
      <header className="site-header">
        <a className="logo" href="#top" aria-label="Space Buro home"><span>SPACE</span><span>BURO</span></a>
        <nav className={`main-nav ${menuOpen ? "open" : ""}`} aria-label="Main navigation">
          {t.nav.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </nav>
        <div className="header-actions">
          <button className="language" type="button" onClick={() => setLang(lang === "ru" ? "en" : "ru")} aria-label="Switch language">
            {lang === "ru" ? "EN" : "RU"}
          </button>
          <a className="social-link" href="https://wa.me/971523569697" target="_blank" rel="noreferrer">WA</a>
          <a className="social-link" href="https://t.me/marufkad" target="_blank" rel="noreferrer">TG</a>
          <button className="menu-button" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="Open menu"><span /><span /></button>
        </div>
      </header>

      <section className="hero-light" aria-label={heroSlides[heroSlide].title[lang]}>
        <div className="hero-content">
          <p className="eyebrow">{heroSlides[heroSlide].tag[lang]}</p>
          <h1 key={`${lang}-${heroSlide}`}>{heroSlides[heroSlide].title[lang]}</h1>
          <p className="hero-description">{heroSlides[heroSlide].text[lang]}</p>
          <div className="hero-ctas">
            <a className="button button-primary" href="#projects">{t.heroPrimary}<span>↘</span></a>
            <a className="button button-secondary" href="#calculator">{t.heroSecondary}<span>→</span></a>
          </div>
          <div className="hero-pagination" aria-label="Hero slides">
            {heroSlides.map((slide, index) => (
              <button key={slide.image} className={heroSlide === index ? "active" : ""} type="button" onClick={() => setHeroSlide(index)} aria-label={`${t.slide} ${index + 1}`}>
                <span>{String(index + 1).padStart(2, "0")}</span><i />
              </button>
            ))}
          </div>
        </div>
        <div className="hero-visual" onPointerMove={handleHeroPointer}>
          {heroSlides.map((slide, index) => (
            <div className={`hero-slide ${heroSlide === index ? "active" : ""}`} key={slide.image}>
              <Image src={slide.image} alt={slide.title[lang]} fill sizes="(max-width: 900px) 100vw, 58vw" priority={index === 0} />
            </div>
          ))}
          <div className="hero-orbit" aria-hidden="true"><span /><span /><b>SPACE<br />BURO</b></div>
          <div className="hero-caption"><span>25.2048° N</span><span>55.2708° E</span></div>
        </div>
      </section>

      <section className="proof-strip" aria-label="Space Buro facts">
        {t.proof.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
      </section>

      <section className="section advantages-section">
        <div className="section-heading" data-reveal>
          <div><p className="eyebrow">{t.advantagesKicker}</p><h2>{t.advantagesTitle}</h2></div>
        </div>
        <div className="advantages-grid">
          {t.advantages.map(([number, title, text], index) => (
            <article key={number} data-reveal style={{ transitionDelay: `${index * 45}ms` }}>
              <span>{number}</span><h3>{title}</h3><p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="projects" className="section projects-section">
        <div className="section-heading" data-reveal>
          <div><p className="eyebrow">{t.projectsKicker}</p><h2>{t.projectsTitle}</h2></div><p>{t.projectsText}</p>
        </div>
        <div className="filter-bar" data-reveal>
          {filterOrder.map((key) => (
            <button key={key} type="button" className={projectFilter === key ? "active" : ""} onClick={() => setProjectFilter(key)}>
              {t.filters[key]}<sup>{projectLocations.filter((project) => key === "all" || project.category === key).length}</sup>
            </button>
          ))}
        </div>
        <div className="projects-grid">
          {filteredProjects.map((project, index) => (
            <Link className="project-card" href={`/projects/${project.id}`} key={project.id} data-reveal style={{ transitionDelay: `${index * 55}ms` }}>
              <div className="project-card-image"><ProjectVisual project={project} lang={lang} priority={index < 2} /><span className={`status-badge ${project.status}`}>{t[project.status]}</span></div>
              <div className="project-card-copy">
                <p>{categoryLabels[lang][project.category]} · {project.year}</p>
                <h3>{project.shortTitle[lang]}</h3>
                <div><span>{project.district}</span><span>{project.area[lang]}</span></div>
                <b>{t.openProject}<i>↗</i></b>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="brands-marquee" aria-label={t.brandsKicker}>
        <p>{t.brandsKicker}</p>
        <div className="marquee-window"><div className="marquee-track">{[...brands, ...brands].map((brand, index) => <span key={`${brand}-${index}`}>{brand}<i>✦</i></span>)}</div></div>
      </section>

      <section id="map" className="section map-section">
        <div className="section-heading" data-reveal>
          <div><p className="eyebrow">{t.mapKicker}</p><h2>{t.mapTitle}</h2></div><p>{t.mapText}</p>
        </div>
        <div className="filter-bar map-filters" data-reveal>
          {filterOrder.map((key) => <button key={key} className={mapFilter === key ? "active" : ""} type="button" onClick={() => chooseMapFilter(key)}>{t.filters[key]}</button>)}
        </div>
        <div className="map-layout" data-reveal>
          <div className="map-shell"><ProjectMap projects={mapProjects} selectedId={selected.id} lang={lang} onSelect={setSelectedProject} /></div>
          <aside className="map-projects">
            {mapProjects.map((project) => (
              <button key={project.id} type="button" className={selected.id === project.id ? "active" : ""} onClick={() => setSelectedProject(project.id)}>
                <i className={project.category}>{categoryLabels[lang][project.category].slice(0, 2)}</i>
                <span><strong>{project.shortTitle[lang]}</strong><small>{project.district} · {project.year}</small></span><b>↗</b>
              </button>
            ))}
          </aside>
        </div>
        <article className="selected-map-card" data-reveal>
          <span className={`status-badge ${selected.status}`}>{t[selected.status]}</span>
          <div><p>{categoryLabels[lang][selected.category]} · {selected.area[lang]}</p><h3>{selected.title[lang]}</h3></div>
          <p>{selected.summary[lang]}</p>
          <Link href={`/projects/${selected.id}`}>{t.mapOpen}<span>↗</span></Link>
        </article>
      </section>

      <section id="china" className="section china-section">
        <div className="china-visual" data-reveal>
          <Image src="/media/china-furniture-concept.webp" alt={t.chinaTitle} fill sizes="(max-width: 900px) 100vw, 55vw" />
          <small>{t.concept}</small>
        </div>
        <div className="china-copy" data-reveal>
          <p className="eyebrow">{t.chinaKicker}</p><h2>{t.chinaTitle}</h2><p>{t.chinaText}</p>
          <div className="china-steps">{t.chinaSteps.map(([number, title, text]) => <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
          <a className="button button-primary" href="#contact">{t.chinaCta}<span>→</span></a>
        </div>
      </section>

      <section id="process" className="section process-section">
        <div className="section-heading" data-reveal>
          <div><p className="eyebrow">{t.processKicker}</p><h2>{t.processTitle}</h2></div><p>{t.processText}</p>
        </div>
        <div className="stage-buttons" data-reveal>
          {stages.map((stage, index) => (
            <button key={stage.number} type="button" className={activeStage === index ? "active" : ""} onMouseEnter={() => setActiveStage(index)} onFocus={() => setActiveStage(index)} onClick={() => setActiveStage(index)}>
              <span>{stage.number}</span><strong>{stage.title[lang]}</strong>
              <aside className="stage-peek"><StageIcon name={stage.icon} /><small>{t.result}</small><b>{stage.result[lang]}</b></aside>
            </button>
          ))}
        </div>
        <article className="stage-detail" key={`${lang}-${activeStage}`} data-reveal>
          <div className="stage-detail-icon"><StageIcon name={stages[activeStage].icon} /></div>
          <div><p className="eyebrow">{t.stage} {stages[activeStage].number}</p><h3>{stages[activeStage].title[lang]}</h3><p>{stages[activeStage].text[lang]}</p></div>
          <div className="stage-result"><span>{t.result}</span><strong>{stages[activeStage].result[lang]}</strong></div>
        </article>
      </section>

      <section className="section developers-section">
        <div className="section-heading" data-reveal>
          <div><p className="eyebrow">{t.developersKicker}</p><h2>{t.developersTitle}</h2></div><p>{t.developersText}</p>
        </div>
        <div className="developers-grid" data-reveal>{developers.map((developer, index) => <div key={developer}><span>{String(index + 1).padStart(2, "0")}</span><strong>{developer}</strong></div>)}</div>
      </section>

      <section id="calculator" className="section calculator-section">
        <div className="calculator-copy" data-reveal><p className="eyebrow">{t.calculatorKicker}</p><h2>{t.calculatorTitle}</h2><p>{t.calculatorText}</p></div>
        <div className="calculator-card" data-reveal>
          <div className="calculator-tabs">{(["renovation", "furniture", "china"] as CalculatorType[]).map((type) => <button type="button" key={type} className={calculatorType === type ? "active" : ""} onClick={() => setCalculatorType(type)}>{t.calcTabs[type]}</button>)}</div>
          <div className="calculator-controls">
            {calculatorType === "renovation" && <>
              <label><span>{t.area}<b>{area} m²</b></span><input type="range" min="30" max="600" step="10" value={area} onChange={(event) => setArea(Number(event.target.value))} /></label>
              <fieldset><legend>{t.level}</legend><div>{(["cosmetic", "standard", "premium"] as const).map((level) => <button key={level} className={renovationLevel === level ? "active" : ""} type="button" onClick={() => setRenovationLevel(level)}>{t.levels[level]}</button>)}</div></fieldset>
            </>}
            {calculatorType === "furniture" && <label><span>{t.meters}<b>{furnitureMeters} m</b></span><input type="range" min="2" max="60" step="1" value={furnitureMeters} onChange={(event) => setFurnitureMeters(Number(event.target.value))} /></label>}
            {calculatorType === "china" && <label><span>{t.rooms}<b>{rooms}</b></span><input type="range" min="1" max="12" step="1" value={rooms} onChange={(event) => setRooms(Number(event.target.value))} /></label>}
          </div>
          <div className="estimate-box"><span>{t.estimate}</span><strong>AED {formatAed(estimate[0], lang)} — {formatAed(estimate[1], lang)}</strong><p>{t.estimateNote}</p><button className="button button-primary" type="button" onClick={contactEstimate}>{t.calcCta}<span>↗</span></button></div>
        </div>
      </section>

      <section id="team" className="section team-section">
        <div className="section-heading" data-reveal>
          <div><p className="eyebrow">{t.teamKicker}</p><h2>{t.teamTitle}</h2></div><p>{t.teamText}</p>
        </div>
        <div className="team-grid">
          {team.map((member, index) => (
            <article id={`team-${member.id}`} className="team-card" key={member.id} data-reveal style={{ transitionDelay: `${index * 70}ms` }}>
              <div className="team-photo"><Image src={member.image} alt={member.name[lang]} fill sizes="(max-width: 720px) 100vw, 33vw" /><span>{String(index + 1).padStart(2, "0")}</span></div>
              <div className="team-copy"><p>{member.role[lang]}</p><h3>{member.name[lang]}</h3><span>{member.experience[lang]}</span><small>{t.participation}</small><div>{member.projects.map((projectId) => { const project = projectLocations.find((item) => item.id === projectId); return project ? <Link key={projectId} href={`/projects/${projectId}`}>{project.shortTitle[lang]}</Link> : null; })}</div></div>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="section contact-section">
        <div className="contact-copy" data-reveal><p className="eyebrow">{t.contactKicker}</p><h2>{t.contactTitle}</h2><p>{t.contactText}</p><div><a href="tel:+971523569697">+971 52 356 9697</a><a href="mailto:info@space-buro.ae">info@space-buro.ae</a><a href="https://t.me/marufkad" target="_blank" rel="noreferrer">Telegram ↗</a></div></div>
        <form className="contact-form" onSubmit={handleSubmit} data-reveal>
          <label><span>{t.name}</span><input name="name" required /></label>
          <label><span>{t.phone}</span><input name="phone" type="tel" required /></label>
          <label className="wide"><span>{t.type}</span><select name="type">{t.projectTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
          <label className="wide"><span>{t.message}</span><textarea name="message" rows={4} /></label>
          <button className="button button-primary form-submit" type="submit">{t.submit}<span>↗</span></button>
        </form>
      </section>

      <footer><a className="logo footer-logo" href="#top"><span>SPACE</span><span>BURO</span></a><p>Dubai, United Arab Emirates</p><div><a href="https://wa.me/971523569697" target="_blank" rel="noreferrer">WhatsApp</a><a href="https://t.me/marufkad" target="_blank" rel="noreferrer">Telegram</a><a href="https://www.instagram.com/space.buro.ae/" target="_blank" rel="noreferrer">Instagram</a></div><small>© {new Date().getFullYear()} Space Buro</small></footer>
    </main>
  );
}
