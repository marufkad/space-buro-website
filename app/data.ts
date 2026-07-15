export type Lang = "ru" | "en";

export type Localized = { ru: string; en: string };

export type ProjectLocation = {
  id: string;
  title: Localized;
  district: string;
  category: "fitout" | "furniture" | "commercial";
  status: "completed" | "progress";
  year: string;
  lat: number;
  lng: number;
  summary: Localized;
  published: boolean;
};

export const projectLocations: ProjectLocation[] = [
  {
    id: "fujairah-trade-centre",
    title: { ru: "Office fit-out — Fujairah Trade Centre", en: "Office fit-out — Fujairah Trade Centre" },
    district: "Fujairah",
    category: "commercial",
    status: "completed",
    year: "2026",
    lat: 25.1288,
    lng: 56.3265,
    summary: {
      ru: "Офис 330 м²: инженерия, отделка, четыре санузла, встроенная мебель и комплектация.",
      en: "330 m² office: MEP, finishes, four washrooms, bespoke furniture and final setup.",
    },
    published: true,
  },
  {
    id: "dubai-creek-harbour",
    title: { ru: "Apartment & furniture — Creek Harbour", en: "Apartment & furniture — Creek Harbour" },
    district: "Dubai Creek Harbour",
    category: "furniture",
    status: "completed",
    year: "2026",
    lat: 25.1973,
    lng: 55.3593,
    summary: {
      ru: "Кухонные фасады, шкафы, консоли и мебельные решения по индивидуальным чертежам.",
      en: "Kitchen fronts, wardrobes, consoles and bespoke furniture based on detailed drawings.",
    },
    published: false,
  },
  {
    id: "al-furjan-villa",
    title: { ru: "Custom furniture — Al Furjan Villa", en: "Custom furniture — Al Furjan Villa" },
    district: "Al Furjan",
    category: "furniture",
    status: "completed",
    year: "2026",
    lat: 25.0288,
    lng: 55.1518,
    summary: {
      ru: "Комплекс встроенной мебели для виллы: кухни, гардеробные, TV-unit и спальни.",
      en: "A complete bespoke furniture package: kitchens, wardrobes, TV units and bedrooms.",
    },
    published: false,
  },
  {
    id: "al-barari-villa",
    title: { ru: "Built-in furniture — Al Barari", en: "Built-in furniture — Al Barari" },
    district: "Al Barari",
    category: "furniture",
    status: "completed",
    year: "2026",
    lat: 25.0981,
    lng: 55.3152,
    summary: {
      ru: "Гардеробные и встроенная мебель с push-to-open механизмами и точной подгонкой.",
      en: "Wardrobes and built-in furniture with push-to-open mechanisms and precise installation.",
    },
    published: false,
  },
  {
    id: "dubai-hills-acacia",
    title: { ru: "Villa fit-out — Dubai Hills", en: "Villa fit-out — Dubai Hills" },
    district: "Dubai Hills",
    category: "fitout",
    status: "progress",
    year: "2026",
    lat: 25.1137,
    lng: 55.2458,
    summary: {
      ru: "Ремонт виллы, инженерная координация, отделка и индивидуальные мебельные решения.",
      en: "Villa renovation, technical coordination, finishes and bespoke furniture solutions.",
    },
    published: false,
  },
  {
    id: "port-de-la-mer",
    title: { ru: "Apartment renovation — Port de La Mer", en: "Apartment renovation — Port de La Mer" },
    district: "Port de La Mer",
    category: "fitout",
    status: "progress",
    year: "2026",
    lat: 25.2383,
    lng: 55.2531,
    summary: {
      ru: "Ремонт квартиры с согласованиями, инженерными изменениями и мебелью на заказ.",
      en: "Apartment renovation with approvals, MEP modifications and bespoke furniture.",
    },
    published: false,
  },
];

export const fujairahImages = [
  "/media/project-fujairah-01.webp",
  "/media/project-fujairah-02.webp",
  "/media/project-fujairah-03.webp",
  "/media/project-fujairah-04.webp",
];

export const stages = [
  {
    number: "01",
    title: { ru: "Бриф и консультация", en: "Brief & consultation" },
    text: { ru: "Определяем задачи, стиль, бюджет и ожидаемые сроки.", en: "We define goals, style, budget and expected timing." },
    result: { ru: "Результат: зафиксированный бриф", en: "Deliverable: approved project brief" },
  },
  {
    number: "02",
    title: { ru: "Выезд и замеры", en: "Site visit & survey" },
    text: { ru: "Снимаем размеры, проверяем инженерные системы и особенности объекта.", en: "We survey dimensions, MEP systems and site conditions." },
    result: { ru: "Результат: обмерный план", en: "Deliverable: measured survey" },
  },
  {
    number: "03",
    title: { ru: "Концепция и дизайн", en: "Concept & design" },
    text: { ru: "Разрабатываем планировку, материалы, свет и мебельные решения.", en: "We develop layout, materials, lighting and furniture solutions." },
    result: { ru: "Результат: утверждённая концепция", en: "Deliverable: approved concept" },
  },
  {
    number: "04",
    title: { ru: "Чертежи и согласования", en: "Drawings & approvals" },
    text: { ru: "Готовим рабочие чертежи, NOC и пакет для building management.", en: "We prepare technical drawings, NOCs and building submissions." },
    result: { ru: "Результат: готовность к старту", en: "Deliverable: construction-ready set" },
  },
  {
    number: "05",
    title: { ru: "Смета и договор", en: "Estimate & contract" },
    text: { ru: "Фиксируем объём, материалы, стоимость, график и ответственность.", en: "We confirm scope, materials, price, schedule and responsibilities." },
    result: { ru: "Результат: прозрачный бюджет", en: "Deliverable: transparent budget" },
  },
  {
    number: "06",
    title: { ru: "Ремонт и инженерия", en: "Fit-out & MEP" },
    text: { ru: "Выполняем демонтаж, MEP, потолки, отделку и финишные работы.", en: "We deliver demolition, MEP, ceilings, finishes and final works." },
    result: { ru: "Результат: готовая отделка", en: "Deliverable: completed fit-out" },
  },
  {
    number: "07",
    title: { ru: "Производство мебели", en: "Furniture production" },
    text: { ru: "Производим мебель параллельно ремонту и устанавливаем по чертежам.", en: "Furniture is produced alongside fit-out and installed to drawings." },
    result: { ru: "Результат: полностью собранный интерьер", en: "Deliverable: fully installed interior" },
  },
  {
    number: "08",
    title: { ru: "Контроль и передача", en: "Quality control & handover" },
    text: { ru: "Проверяем качество, закрываем замечания и передаём документы.", en: "We inspect quality, close snags and hand over documents." },
    result: { ru: "Результат: готовый объект и гарантия", en: "Deliverable: completed project & warranty" },
  },
];

export const team = [
  {
    id: "maruf",
    name: { ru: "Маруф Кодиров", en: "Maruf Kodirov" },
    role: { ru: "Основатель · Архитектор", en: "Founder · Architect" },
    image: "/media/team-maruf.webp",
    experience: { ru: "Архитектура, строительство, fit-out и мебель на заказ.", en: "Architecture, construction, fit-out and bespoke furniture." },
    projects: ["Fujairah Trade Centre", "Creek Harbour", "Al Furjan"],
  },
  {
    id: "quvvat",
    name: { ru: "Кувват Худайяров", en: "Quvvat Khudayyarov" },
    role: { ru: "Главный инженер", en: "Lead Engineer" },
    image: "/media/team-quvvat.webp",
    experience: { ru: "Электрика, HVAC, электромеханика и технический контроль.", en: "Electrical, HVAC, electromechanical works and technical supervision." },
    projects: ["Fujairah Trade Centre", "Dubai Hills", "Al Barari"],
  },
  {
    id: "serdar",
    name: { ru: "Сердар Пиркулиев", en: "Serdar Pirkuliev" },
    role: { ru: "Координатор проектов", en: "Project Coordinator" },
    image: "/media/team-serdar.webp",
    experience: { ru: "Координация работ, снабжение и контроль комплектации объектов.", en: "Site coordination, procurement and project material control." },
    projects: ["Fujairah Trade Centre", "Al Furjan", "Creek Harbour"],
  },
];
