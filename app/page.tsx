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
  type ProjectMapType,
} from "./data";

const ProjectMap = dynamic(() => import("./ProjectMap"), {
  ssr: false,
  loading: () => <div className="map-loading">Loading project map…</div>,
});

type MapFilter = "all" | "renovation" | "furniture" | "residential" | "commercial" | "china";
type CalculatorType = "renovation" | "furniture";
type PropertyType = "apartment" | "villa" | "commercial";
type FurnitureLevel = "standard" | "premium";

const mapFilterOrder: MapFilter[] = ["all", "renovation", "furniture", "residential", "commercial", "china"];

function matchesMapFilter(project: ProjectLocation, filter: MapFilter) {
  if (filter === "all") return true;
  if (filter === "renovation") return project.category === "fitout" || project.category === "commercial";
  if (filter === "residential") return project.category === "fitout" || project.category === "furniture";
  return project.category === filter;
}

const categoryLabels: Record<Lang, Record<ProjectCategory, string>> = {
  ru: { fitout: "Fit-out", furniture: "Мебель", china: "Мебель из Китая", commercial: "Коммерческие" },
  en: { fitout: "Fit-out", furniture: "Furniture", china: "Furniture from China", commercial: "Commercial" },
};

const heroSlides = [
  {
    image: "/media/china-furniture-photo.webp",
    title: { ru: "Интерьер под ключ — от идеи до готового пространства", en: "Turnkey interiors — from idea to completed space" },
    text: { ru: "Дизайн, согласования, ремонт и мебель в одной ответственной команде.", en: "Design, approvals, fit-out and furniture under one accountable team." },
    tag: { ru: "Ремонт · Fit-out · Мебель", en: "Renovation · Fit-out · Furniture" },
  },
  {
    image: "/media/project-fujairah-04.webp",
    title: { ru: "Показываем не только кадры, но и факты проекта", en: "More than imagery: every project comes with facts" },
    text: { ru: "Площадь, сроки, состав работ, команда и география — в одной карточке объекта.", en: "Area, timing, scope, team and geography — connected in one project profile." },
    tag: { ru: "Библиотека объектов", en: "Project library" },
  },
  {
    image: "/media/china-furniture-concept.webp",
    title: { ru: "Мебель из Китая с контролем и установкой — от фабрики до Дубая", en: "Furniture from China with control and installation — from factory to Dubai" },
    text: { ru: "Подбор фабрик, образцы, контроль качества, консолидация и доставка.", en: "Factory sourcing, samples, quality control, consolidation and delivery." },
    tag: { ru: "Dubai · Foshan", en: "Dubai · Foshan" },
  },
] as const;

const ui = {
  ru: {
    nav: [["Почему мы", "#why"], ["Объекты", "#projects"], ["Карта", "#map"], ["Китай", "#china"], ["Этапы", "#process"], ["Калькулятор", "#calculator"], ["Команда", "#team"]],
    heroPrimary: "Смотреть объекты",
    heroSecondary: "Рассчитать проект",
    slide: "Слайд",
    advantagesKicker: "Почему Space Buro",
    advantagesTitle: "Снимаем риски, которые обычно остаются между подрядчиками",
    advantages: [
      ["01", "", "10+", " лет практического опыта", "Опыт ключевых специалистов в ремонте, инженерии, строительстве и мебели на заказ."],
      ["02", "", "RU / EN", " — коммуникация без барьеров", "Ведём проект на русском или английском и переводим технические решения на понятный язык."],
      ["03", "Собственное производство ", "мебели", "", "Ремонт и корпусная мебель синхронизированы по чертежам и срокам."],
      ["04", "", "Русскоязычная", " команда", "Обсуждаем сложные технические вопросы без потери смысла; работаем также на английском."],
      ["05", "", "Быстрое", " согласование и NOC", "Координируем building management, необходимые разрешения и доступ на объект."],
      ["06", "", "Прозрачная", " смета", "Разделяем работы, материалы и изменения, чтобы бюджет оставался управляемым."],
      ["07", "Еженедельный ", "фотоотчёт", "", "Показываем прогресс, следующие работы и вопросы, требующие решения."],
      ["08", "", "Гарантия", " и aftercare", "Закрываем замечания после передачи и остаёмся на связи по гарантии."],
    ],
    projectsKicker: "Библиотека объектов",
    projectsTitle: "Проекты связаны с картой, файлами и командой",
    projectsText: "Фильтры действительно меняют подборку. Откройте карточку, чтобы увидеть факты, фотографии, состав работ и участников.",
    mapFilters: { all: "Все", renovation: "Реновация", furniture: "Мебель", residential: "Жильё", commercial: "Коммерция", china: "Мебель из Китая" },
    noPhotos: "Фотографии готовятся",
    openProject: "Открыть объект",
    showAllProjects: "Показать все объекты",
    hideProjects: "Скрыть лишние",
    showAllMap: "Показать все объекты на карте",
    hideMap: "Свернуть список",
    modalDetails: "Информация об объекте",
    fullPage: "Открыть полную страницу",
    close: "Закрыть",
    completed: "Завершён",
    progress: "В работе",
    service: "Услуга",
    brandsKicker: "Бренды, с которыми мы работаем",
    mapKicker: "География проектов",
    mapTitle: "Выберите категорию, затем объект на карте ОАЭ",
    mapText: "Иконка показывает тип объекта. Точный номер квартиры или виллы не публикуется.",
    mapOpen: "Страница объекта",
    chinaKicker: "Дубай · Гуанчжоу · Фошань · Чэнду",
    chinaTitle: "Заказ мебели из Китая",
    chinaText: "Мы превращаем поездку по шоурумам и фабрикам в управляемый процесс: от ведомости мебели до доставки и установки в ОАЭ.",
    chinaSteps: [["01", "Комплектация", "Собираем ведомость, размеры, стиль и бюджет."], ["02", "Фабрики и образцы", "Сравниваем предложения и проверяем материалы."], ["03", "Контроль", "Сверяем производство с утверждённой спецификацией."], ["04", "Логистика", "Консолидируем, доставляем и координируем монтаж."]],
    concept: "Визуальная концепция услуги, не реализованный объект",
    chinaCta: "Обсудить комплектацию",
    processKicker: "Этапы работы",
    processTitle: "Этапы работы",
    processText: "Выберите номер этапа, чтобы увидеть задачи и понятный результат.",
    stage: "Этап",
    result: "Результат",
    developersKicker: "Девелоперы Дубая",
    developersTitle: "Работаем с объектами ведущих застройщиков",
    developersText: "Знаем, что требования к доступу, NOC и проведению работ различаются в каждом здании и community. Названия ниже обозначают объекты девелоперов, а не официальное партнёрство.",
    calculatorKicker: "Предварительный расчёт",
    calculatorTitle: "Калькулятор стоимости",
    calculatorText: "Это диапазон для планирования, не коммерческое предложение. Точная смета появляется после замера и согласования состава работ.",
    calcTabs: { renovation: "Ремонт", furniture: "Мебель" },
    area: "Площадь помещения",
    propertyType: "Тип объекта",
    propertyTypes: { apartment: "Квартира", villa: "Вилла", commercial: "Офис / коммерция" },
    level: "Уровень ремонта",
    levels: { cosmetic: "Косметический", standard: "Полный", premium: "Премиальный" },
    meters: "Погонные метры мебели",
    furnitureLevel: "Класс материалов",
    furnitureLevels: { standard: "Практичный", premium: "Премиальный" },
    includeVat: "Добавить VAT 5%",
    timeline: "Ориентировочный срок",
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
    nav: [["Why us", "#why"], ["Projects", "#projects"], ["Map", "#map"], ["China", "#china"], ["Process", "#process"], ["Calculator", "#calculator"], ["Team", "#team"]],
    heroPrimary: "Explore projects",
    heroSecondary: "Estimate a project",
    slide: "Slide",
    advantagesKicker: "Why Space Buro",
    advantagesTitle: "We remove the risks that usually sit between contractors",
    advantages: [
      ["01", "", "10+", " years of practical experience", "Key specialists bring hands-on experience in fit-out, engineering, construction and bespoke furniture."],
      ["02", "", "RU / EN", " communication without barriers", "We run the project in Russian or English and explain technical decisions in plain language."],
      ["03", "In-house ", "furniture", " production", "Fit-out and joinery are coordinated through shared drawings and schedules."],
      ["04", "", "Russian-speaking", " team", "Technical decisions remain clear; all project communication is also available in English."],
      ["05", "", "Fast", " approvals and NOCs", "We coordinate building management, permits and site access requirements."],
      ["06", "", "Transparent", " estimates", "Works, materials and variations are separated so the budget stays manageable."],
      ["07", "Weekly ", "photo reports", "", "See progress, next activities and decisions that require your attention."],
      ["08", "", "Warranty", " and aftercare", "We close snags after handover and remain available throughout the warranty."],
    ],
    projectsKicker: "Project library",
    projectsTitle: "Projects connected to maps, files and people",
    projectsText: "The filters update the collection. Open any card for facts, photography, scope and the team involved.",
    mapFilters: { all: "All", renovation: "Renovation", furniture: "Furniture", residential: "Residential", commercial: "Commercial", china: "Furniture from China" },
    noPhotos: "Photography in preparation",
    openProject: "Open project",
    showAllProjects: "Show all projects",
    hideProjects: "Show fewer",
    showAllMap: "Show all map projects",
    hideMap: "Collapse list",
    modalDetails: "Project information",
    fullPage: "Open full project page",
    close: "Close",
    completed: "Completed",
    progress: "In progress",
    service: "Service",
    brandsKicker: "Brands we work with",
    mapKicker: "Project geography",
    mapTitle: "Choose a category, then select a UAE project",
    mapText: "Each icon identifies the project type. Exact unit and villa numbers remain private.",
    mapOpen: "Project page",
    chinaKicker: "Dubai · Guangzhou · Foshan · Chengdu",
    chinaTitle: "Furniture from China",
    chinaText: "We turn showroom and factory sourcing into a controlled process, from the furniture schedule to UAE delivery and installation.",
    chinaSteps: [["01", "Schedule", "We define items, dimensions, style and budget."], ["02", "Factories and samples", "We compare offers and verify materials."], ["03", "Quality control", "Production is checked against the approved specification."], ["04", "Logistics", "We consolidate, deliver and coordinate installation."]],
    concept: "Service concept visual, not a completed project",
    chinaCta: "Discuss furnishing",
    processKicker: "Our process",
    processTitle: "Work stages",
    processText: "Select a stage number to see its tasks and clear deliverable.",
    stage: "Stage",
    result: "Deliverable",
    developersKicker: "Dubai developers",
    developersTitle: "Working in properties by leading developers",
    developersText: "Access, NOC and work requirements vary by building and community. The names below indicate developer properties, not formal partnerships.",
    calculatorKicker: "Preliminary estimate",
    calculatorTitle: "Cost calculator",
    calculatorText: "This is a budget guide, not a quotation. An accurate estimate follows a site survey and confirmed scope.",
    calcTabs: { renovation: "Renovation", furniture: "Furniture" },
    area: "Property area",
    propertyType: "Property type",
    propertyTypes: { apartment: "Apartment", villa: "Villa", commercial: "Office / commercial" },
    level: "Renovation level",
    levels: { cosmetic: "Cosmetic", standard: "Full", premium: "Premium" },
    meters: "Linear metres of furniture",
    furnitureLevel: "Material class",
    furnitureLevels: { standard: "Practical", premium: "Premium" },
    includeVat: "Include 5% VAT",
    timeline: "Indicative timeline",
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

function SocialIcon({ name }: { name: "whatsapp" | "telegram" }) {
  if (name === "telegram") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 3 3.7 9.7c-1.2.5-1.2 1.2-.2 1.5l4.4 1.4 1.7 5.3c.2.7.1 1 .8 1 .5 0 .8-.2 1-.4l2.2-2.1 4.6 3.4c.8.5 1.5.2 1.7-.8L23 4.5C23.3 3.3 22.5 2.8 21 3Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="m8 12.6 10.7-6.7-8.4 8.4-.3 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.4 11.6a8.4 8.4 0 0 1-12.5 7.3L3 20.2l1.3-4.7a8.4 8.4 0 1 1 16.1-3.9Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8.1 7.7c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.8 1.9c.1.3 0 .5-.2.7l-.6.7c-.2.2-.1.4 0 .6.5 1 1.3 1.8 2.3 2.3.3.2.5.2.7 0l.8-1c.2-.2.4-.3.7-.2l1.9.9c.3.1.4.3.4.5 0 .3-.1 1.3-.7 1.8-.6.5-1.4.8-2.4.5-1-.3-2.3-.8-3.8-2.1-1.2-1.1-2.1-2.5-2.4-3.5-.4-1.1-.1-2.4.3-3.1Z" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function MapTypeIcon({ type }: { type: ProjectMapType }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (type === "renovation") return <svg viewBox="0 0 32 32" aria-hidden="true"><path {...common} d="M7 9h12v6H7V9Zm12 3h4v5m0 0h-3v9" /><path {...common} d="m9 23 5-5 4 4-5 5H9v-4Z" /></svg>;
  if (type === "furniture") return <svg viewBox="0 0 32 32" aria-hidden="true"><path {...common} d="M8 15h16v11H8V15Zm3 0V9h10v6M11 26v3m10-3v3M16 9v6" /></svg>;
  if (type === "residential") return <svg viewBox="0 0 32 32" aria-hidden="true"><path {...common} d="m5 15 11-9 11 9v12H5V15Zm8 12v-8h6v8" /></svg>;
  if (type === "commercial") return <svg viewBox="0 0 32 32" aria-hidden="true"><path {...common} d="M7 5h18v23H7V5Zm5 5h2m4 0h2m-8 5h2m4 0h2m-8 5h2m4 0h2m-7 8v-4h6v4" /></svg>;
  return <svg viewBox="0 0 32 32" aria-hidden="true"><path {...common} d="m6 11 10-5 10 5-10 5-10-5Zm0 0v11l10 5 10-5V11M16 16v11" /><path {...common} d="M10 8.5 20 14m-8-7 10 5" /></svg>;
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
  const [projectFilter, setProjectFilter] = useState<MapFilter>("all");
  const [projectsExpanded, setProjectsExpanded] = useState(false);
  const [mapFilter, setMapFilter] = useState<MapFilter>("all");
  const [fitMapProjects, setFitMapProjects] = useState(true);
  const [selectedProject, setSelectedProject] = useState(projectLocations[0].id);
  const [projectModal, setProjectModal] = useState<ProjectLocation | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [calculatorType, setCalculatorType] = useState<CalculatorType>("renovation");
  const [area, setArea] = useState(100);
  const [propertyType, setPropertyType] = useState<PropertyType>("apartment");
  const [renovationLevel, setRenovationLevel] = useState<"cosmetic" | "standard" | "premium">("standard");
  const [furnitureMeters, setFurnitureMeters] = useState(12);
  const [furnitureLevel, setFurnitureLevel] = useState<FurnitureLevel>("standard");
  const [includeVat, setIncludeVat] = useState(false);
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
    () => projectLocations.filter((project) => matchesMapFilter(project, projectFilter)),
    [projectFilter],
  );
  const mapProjects = useMemo(
    () => projectLocations.filter((project) => matchesMapFilter(project, mapFilter)),
    [mapFilter],
  );
  const visibleProjects = projectsExpanded ? filteredProjects : filteredProjects.slice(0, 4);
  const selected = mapProjects.find((project) => project.id === selectedProject) ?? mapProjects[0];

  const estimate = useMemo(() => {
    const vatFactor = includeVat ? 1.05 : 1;
    if (calculatorType === "furniture") {
      const materialFactor = furnitureLevel === "premium" ? 1.35 : 1;
      return [furnitureMeters * 1800 * materialFactor * vatFactor, furnitureMeters * 3300 * materialFactor * vatFactor];
    }
    const rates = { cosmetic: [350, 550], standard: [1105, 1625], premium: [1950, 2990] } as const;
    const propertyFactor = { apartment: 1, villa: 1.12, commercial: 1.08 }[propertyType];
    return [area * rates[renovationLevel][0] * propertyFactor * vatFactor, area * rates[renovationLevel][1] * propertyFactor * vatFactor];
  }, [area, calculatorType, furnitureLevel, furnitureMeters, includeVat, propertyType, renovationLevel]);

  const estimateTimeline = useMemo(() => {
    if (calculatorType === "furniture") {
      const weeks = furnitureLevel === "premium" ? [8, 13] : [5, 9];
      return lang === "ru" ? `${weeks[0]}–${weeks[1]} недель` : `${weeks[0]}–${weeks[1]} weeks`;
    }
    const base = { cosmetic: [4, 8], standard: [8, 14], premium: [12, 20] }[renovationLevel];
    const areaAdjustment = Math.max(0, Math.ceil((area - 150) / 120));
    return lang === "ru"
      ? `${base[0] + areaAdjustment}–${base[1] + areaAdjustment} недель`
      : `${base[0] + areaAdjustment}–${base[1] + areaAdjustment} weeks`;
  }, [area, calculatorType, furnitureLevel, lang, renovationLevel]);

  useEffect(() => {
    if (!projectModal) return;
    const previous = document.body.style.overflow;
    const handleEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setProjectModal(null); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", handleEscape); };
  }, [projectModal]);

  function chooseProjectFilter(value: MapFilter) {
    setProjectFilter(value);
    setProjectsExpanded(false);
  }

  function chooseMapFilter(value: MapFilter) {
    setMapFilter(value);
    setFitMapProjects(true);
    const first = projectLocations.find((project) => matchesMapFilter(project, value));
    if (first) setSelectedProject(first.id);
  }

  function selectMapProject(id: string) {
    setFitMapProjects(false);
    setSelectedProject(id);
  }

  function openProject(project: ProjectLocation) {
    setProjectModal(project);
    setModalImage(project.images[0] ?? project.cover ?? null);
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
    const configuration = calculatorType === "renovation"
      ? `${t.propertyTypes[propertyType]}, ${t.levels[renovationLevel]}, ${area} m²`
      : `${t.furnitureLevels[furnitureLevel]}, ${furnitureMeters} m`;
    const message = lang === "ru"
      ? `Здравствуйте! Хочу уточнить предварительный расчёт: ${t.calcTabs[calculatorType]}, ${configuration}, AED ${formatAed(estimate[0], lang)}–${formatAed(estimate[1], lang)}, срок ${estimateTimeline}${includeVat ? ", с VAT 5%" : ", без VAT"}.`
      : `Hello! I would like to refine this preliminary estimate: ${t.calcTabs[calculatorType]}, ${configuration}, AED ${formatAed(estimate[0], lang)}–${formatAed(estimate[1], lang)}, timeline ${estimateTimeline}${includeVat ? ", including 5% VAT" : ", excluding VAT"}.`;
    window.open(`https://wa.me/971523569697?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <main id="top">
      <header className="site-header">
        <a className="logo" href="#top" aria-label="Space Buro home"><Image src="/space-buro-logo.png" alt="Space Buro" width={104} height={65} priority /></a>
        <nav className={`main-nav ${menuOpen ? "open" : ""}`} aria-label="Main navigation">
          {t.nav.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </nav>
        <div className="header-actions">
          <button className="language" type="button" onClick={() => setLang(lang === "ru" ? "en" : "ru")} aria-label="Switch language">
            {lang === "ru" ? "EN" : "RU"}
          </button>
          <a className="social-link" href="https://wa.me/971523569697" target="_blank" rel="noreferrer" aria-label="WhatsApp"><SocialIcon name="whatsapp" /></a>
          <a className="social-link" href="https://t.me/marufkad" target="_blank" rel="noreferrer" aria-label="Telegram"><SocialIcon name="telegram" /></a>
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
          <div className="hero-caption"><span>25.2048° N</span><span>55.2708° E</span></div>
        </div>
      </section>

      <section id="why" className="section advantages-section">
        <div className="section-heading" data-reveal>
          <div><p className="eyebrow">{t.advantagesKicker}</p><h2>{t.advantagesTitle}</h2></div>
        </div>
        <div className="advantages-grid">
          {t.advantages.map(([number, before, accent, after, text], index) => (
            <article key={number} data-reveal style={{ transitionDelay: `${index * 45}ms` }}>
              <span>{number}</span><h3>{before}<em>{accent}</em>{after}</h3><p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="projects" className="section projects-section">
        <div className="section-heading" data-reveal>
          <div><p className="eyebrow">{t.projectsKicker}</p><h2>{t.projectsTitle}</h2></div><p>{t.projectsText}</p>
        </div>
        <div className="filter-bar" data-reveal>
          {mapFilterOrder.map((key) => (
            <button key={key} type="button" className={projectFilter === key ? "active" : ""} onClick={() => chooseProjectFilter(key)}>
              {t.mapFilters[key]}<sup>{projectLocations.filter((project) => matchesMapFilter(project, key)).length}</sup>
            </button>
          ))}
        </div>
        <div className="projects-grid">
          {visibleProjects.map((project, index) => (
            <button className="project-card" type="button" onClick={() => openProject(project)} key={project.id}>
              <div className="project-card-image"><ProjectVisual project={project} lang={lang} priority={index < 2} /><span className={`status-badge ${project.status}`}>{t[project.status]}</span></div>
              <div className="project-card-copy">
                <p>{categoryLabels[lang][project.category]} · {project.year}</p>
                <h3>{project.shortTitle[lang]}</h3>
              </div>
            </button>
          ))}
        </div>
        {filteredProjects.length > 4 && <button className={`expand-button ${projectsExpanded ? "open" : ""}`} type="button" onClick={() => setProjectsExpanded((value) => !value)}><span>{projectsExpanded ? t.hideProjects : t.showAllProjects}</span><i>↓</i></button>}
      </section>

      <section className="brands-marquee" aria-label={t.brandsKicker}>
        <p>{t.brandsKicker}</p>
        <div className="marquee-window"><div className="marquee-track">{[...brands, ...brands].map((brand, index) => <span data-brand={brand.name} key={`${brand.name}-${index}`}><Image src={brand.logo} alt={brand.name} width={176} height={58} /><i>✦</i></span>)}</div></div>
      </section>

      <section id="map" className="section map-section">
        <div className="section-heading" data-reveal>
          <div><p className="eyebrow">{t.mapKicker}</p><h2>{t.mapTitle}</h2></div><p>{t.mapText}</p>
        </div>
        <div className="filter-bar map-filters" data-reveal>
          {mapFilterOrder.map((key) => <button key={key} className={mapFilter === key ? "active" : ""} type="button" onClick={() => chooseMapFilter(key)}>{t.mapFilters[key]}<sup>{projectLocations.filter((project) => matchesMapFilter(project, key)).length}</sup></button>)}
        </div>
        <div className="map-layout" data-reveal>
          <div className="map-shell"><ProjectMap projects={mapProjects} selectedId={selected.id} lang={lang} fitAll={fitMapProjects} onSelect={selectMapProject} /></div>
          <aside className="map-projects">
            {mapProjects.map((project) => (
              <button key={project.id} type="button" className={selected.id === project.id ? "active" : ""} onClick={() => selectMapProject(project.id)}>
                <i className={project.mapType}><MapTypeIcon type={project.mapType} /></i>
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
        </div>
        <div className="china-copy" data-reveal>
          <span className="china-signature" aria-hidden="true">中国家具采购</span>
          <p className="eyebrow">{t.chinaKicker}</p><h2>{t.chinaTitle}</h2><p>{t.chinaText}</p>
          <div className="china-steps">{t.chinaSteps.map(([number, title, text]) => <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
          <Link className="button button-primary" href="/china-furniture">{t.chinaCta}<span>→</span></Link>
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
        <div className="developers-grid" data-reveal>{developers.map((developer, index) => <div key={developer.name} className={`${developer.invert ? "invert-logo " : ""}developer-${developer.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{developer.logo ? <span className="developer-logo"><Image src={developer.logo} alt={developer.name} fill sizes="(max-width: 620px) 42vw, 210px" /></span> : <strong>{developer.name}</strong>}</div>)}</div>
      </section>

      <section id="calculator" className="section calculator-section">
        <div className="calculator-copy" data-reveal><p className="eyebrow">{t.calculatorKicker}</p><h2>{t.calculatorTitle}</h2><p>{t.calculatorText}</p></div>
        <div className="calculator-card" data-reveal>
          <div className="calculator-tabs">{(["renovation", "furniture"] as CalculatorType[]).map((type) => <button type="button" key={type} className={calculatorType === type ? "active" : ""} onClick={() => setCalculatorType(type)}>{t.calcTabs[type]}</button>)}</div>
          <div className="calculator-controls">
            {calculatorType === "renovation" && <>
              <label><span>{t.area}<b>{area} m²</b></span><input type="range" min="30" max="600" step="10" value={area} onChange={(event) => setArea(Number(event.target.value))} /></label>
              <fieldset><legend>{t.propertyType}</legend><div>{(["apartment", "villa", "commercial"] as PropertyType[]).map((type) => <button key={type} className={propertyType === type ? "active" : ""} type="button" onClick={() => setPropertyType(type)}>{t.propertyTypes[type]}</button>)}</div></fieldset>
              <fieldset><legend>{t.level}</legend><div>{(["cosmetic", "standard", "premium"] as const).map((level) => <button key={level} className={renovationLevel === level ? "active" : ""} type="button" onClick={() => setRenovationLevel(level)}>{t.levels[level]}</button>)}</div></fieldset>
            </>}
            {calculatorType === "furniture" && <>
              <label><span>{t.meters}<b>{furnitureMeters} m</b></span><input type="range" min="2" max="60" step="1" value={furnitureMeters} onChange={(event) => setFurnitureMeters(Number(event.target.value))} /></label>
              <fieldset><legend>{t.furnitureLevel}</legend><div className="two-options">{(["standard", "premium"] as FurnitureLevel[]).map((level) => <button key={level} className={furnitureLevel === level ? "active" : ""} type="button" onClick={() => setFurnitureLevel(level)}>{t.furnitureLevels[level]}</button>)}</div></fieldset>
            </>}
            <label className="vat-toggle"><input type="checkbox" checked={includeVat} onChange={(event) => setIncludeVat(event.target.checked)} /><span>{t.includeVat}</span></label>
          </div>
          <div className="estimate-box"><span>{t.estimate}</span><strong>AED {formatAed(estimate[0], lang)} — {formatAed(estimate[1], lang)}</strong><div className="estimate-timeline"><span>{t.timeline}</span><b>{estimateTimeline}</b></div><p>{t.estimateNote}</p><button className="button button-primary" type="button" onClick={contactEstimate}>{t.calcCta}<span>↗</span></button></div>
        </div>
      </section>

      <section id="team" className="section team-section">
        <div className="section-heading" data-reveal>
          <div><p className="eyebrow">{t.teamKicker}</p><h2>{t.teamTitle}</h2></div><p>{t.teamText}</p>
        </div>
        <div className="team-grid">
          {team.map((member, index) => (
            <article id={`team-${member.id}`} className={`team-card team-card-${member.id}`} key={member.id} data-reveal style={{ transitionDelay: `${index * 70}ms` }}>
              <div className="team-photo"><Image src={member.image} alt={member.name[lang]} fill sizes="(max-width: 720px) 100vw, 33vw" /><span>{String(index + 1).padStart(2, "0")}</span></div>
              <div className="team-copy"><p>{member.role[lang]}</p><h3>{member.name[lang]}</h3><span>{member.experience[lang]}</span>{member.id !== "maruf" && <><small>{t.participation}</small><div>{projectLocations.filter((project) => project.teamIds.includes(member.id)).map((project) => <Link href={`/projects/${project.id}`} key={project.id}>{project.shortTitle[lang]}</Link>)}</div></>}</div>
            </article>
          ))}
        </div>
        <figure className="team-group-photo" data-reveal>
          <Image src="/media/team-group.webp" alt={lang === "ru" ? "Команда Space Buro" : "Space Buro team"} fill sizes="(max-width: 900px) 100vw, 90vw" />
        </figure>
        <div className="team-video" data-reveal>
          <iframe src="https://www.youtube-nocookie.com/embed/fynhXsxRglU?rel=0&amp;modestbranding=1&amp;playsinline=1" title={lang === "ru" ? "Видео о команде Space Buro" : "Space Buro team video"} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
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

      {projectModal && <div className="project-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setProjectModal(null); }}>
        <article className="project-modal" role="dialog" aria-modal="true" aria-label={projectModal.title[lang]}>
          <button className="project-modal-close" type="button" onClick={() => setProjectModal(null)} aria-label={t.close}>×</button>
          <div className="project-modal-visual">
            {modalImage ? <Image src={modalImage} alt={projectModal.title[lang]} fill sizes="(max-width: 800px) 100vw, 68vw" /> : <ProjectVisual project={projectModal} lang={lang} />}
            <span className={`status-badge ${projectModal.status}`}>{t[projectModal.status]}</span>
          </div>
          {projectModal.images.length > 1 && <div className="project-modal-thumbs">{projectModal.images.map((image, index) => <button key={image} type="button" className={modalImage === image ? "active" : ""} onClick={() => setModalImage(image)}><Image src={image} alt={`${projectModal.title[lang]} ${index + 1}`} fill sizes="90px" /></button>)}</div>}
          <div className="project-modal-info">
            <div><p className="eyebrow">{t.modalDetails} · {categoryLabels[lang][projectModal.category]} · {projectModal.year}</p><h2>{projectModal.title[lang]}</h2><p>{projectModal.summary[lang]}</p></div>
            <dl><div><dt>{lang === "ru" ? "Площадь" : "Area"}</dt><dd>{projectModal.area[lang]}</dd></div><div><dt>{lang === "ru" ? "Срок" : "Duration"}</dt><dd>{projectModal.duration[lang]}</dd></div><div><dt>{lang === "ru" ? "География" : "Location"}</dt><dd>{projectModal.district}</dd></div></dl>
            <div className="project-modal-scope"><strong>{lang === "ru" ? "Состав работ" : "Scope of work"}</strong><ul>{projectModal.scope.map((item) => <li key={item.en}>{item[lang]}</li>)}</ul></div>
            <div className="project-modal-team"><strong>{lang === "ru" ? "Участники" : "Team"}</strong><div>{team.filter((member) => projectModal.teamIds.includes(member.id)).map((member) => <a href={`#team-${member.id}`} key={member.id} onClick={() => setProjectModal(null)}>{member.name[lang]}</a>)}</div></div>
            <Link className="button button-primary" href={`/projects/${projectModal.id}`}>{t.fullPage}<span>↗</span></Link>
          </div>
        </article>
      </div>}

      <footer><a className="logo footer-logo" href="#top"><Image src="/space-buro-logo.png" alt="Space Buro" width={104} height={65} /></a><div className="footer-meta"><p>Dubai, United Arab Emirates</p><small>© {new Date().getFullYear()} Space Buro</small></div><div className="footer-links"><a href="https://wa.me/971523569697" target="_blank" rel="noreferrer">WhatsApp</a><a href="https://t.me/marufkad" target="_blank" rel="noreferrer">Telegram</a><a href="https://www.instagram.com/space.buro.ae/" target="_blank" rel="noreferrer">Instagram</a></div></footer>
    </main>
  );
}
