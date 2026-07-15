export type Lang = "ru" | "en";
export type Localized = { ru: string; en: string };
export type ProjectCategory = "fitout" | "furniture" | "china" | "commercial";

export type ProjectLocation = {
  id: string;
  title: Localized;
  shortTitle: Localized;
  district: string;
  category: ProjectCategory;
  status: "completed" | "progress" | "service";
  year: string;
  lat: number;
  lng: number;
  summary: Localized;
  area: Localized;
  duration: Localized;
  cover?: string;
  images: string[];
  teamIds: string[];
  scope: Localized[];
  published: boolean;
};

export const fujairahImages = [
  "/media/project-fujairah-01.webp",
  "/media/project-fujairah-02.webp",
  "/media/project-fujairah-03.webp",
  "/media/project-fujairah-04.webp",
];

export const projectLocations: ProjectLocation[] = [
  {
    id: "fujairah-trade-centre",
    title: { ru: "Office fit-out — Fujairah Trade Centre", en: "Office fit-out — Fujairah Trade Centre" },
    shortTitle: { ru: "Офис Fujairah Trade Centre", en: "Fujairah Trade Centre Office" },
    district: "Fujairah",
    category: "commercial",
    status: "completed",
    year: "2026",
    lat: 25.1288,
    lng: 56.3265,
    summary: {
      ru: "Полный fit-out офиса: инженерия, отделка, четыре санузла, встроенная мебель и финальная комплектация.",
      en: "Complete office fit-out: MEP, finishes, four washrooms, bespoke furniture and final setup.",
    },
    area: { ru: "330 м²", en: "330 m²" },
    duration: { ru: "3 месяца", en: "3 months" },
    cover: fujairahImages[0],
    images: fujairahImages,
    teamIds: ["maruf", "quvvat", "serdar"],
    scope: [
      { ru: "Инженерные системы и электрика", en: "MEP systems and electrical works" },
      { ru: "Потолки, покраска и microcement", en: "Ceilings, painting and microcement" },
      { ru: "Четыре санузла и три utility-помещения", en: "Four washrooms and three utility rooms" },
      { ru: "Кухня, панели и мебель из Egger", en: "Kitchen, wall panels and Egger furniture" },
    ],
    published: true,
  },
  {
    id: "dubai-creek-harbour",
    title: { ru: "Apartment & furniture — Creek Harbour", en: "Apartment & furniture — Creek Harbour" },
    shortTitle: { ru: "Квартира Creek Harbour", en: "Creek Harbour Apartment" },
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
    area: { ru: "Конфиденциально", en: "Private" },
    duration: { ru: "По объёму работ", en: "Scope based" },
    images: [],
    teamIds: ["maruf", "serdar"],
    scope: [
      { ru: "Замена кухонных фасадов", en: "Kitchen front replacement" },
      { ru: "Шкаф для холодильника", en: "Refrigerator housing" },
      { ru: "Консоли и встроенная мебель", en: "Consoles and built-in furniture" },
    ],
    published: true,
  },
  {
    id: "al-furjan-villa",
    title: { ru: "Custom furniture — Al Furjan Villa", en: "Custom furniture — Al Furjan Villa" },
    shortTitle: { ru: "Мебель для виллы Al Furjan", en: "Al Furjan Villa Furniture" },
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
    area: { ru: "Вилла", en: "Villa" },
    duration: { ru: "Индивидуальный график", en: "Custom schedule" },
    images: [],
    teamIds: ["maruf", "serdar"],
    scope: [
      { ru: "Основная и техническая кухни", en: "Main and secondary kitchens" },
      { ru: "Гардеробные и встроенные шкафы", en: "Walk-in and built-in wardrobes" },
      { ru: "TV-unit и мебель спален", en: "TV units and bedroom furniture" },
    ],
    published: true,
  },
  {
    id: "al-barari-villa",
    title: { ru: "Built-in furniture — Al Barari", en: "Built-in furniture — Al Barari" },
    shortTitle: { ru: "Встроенная мебель Al Barari", en: "Al Barari Built-in Furniture" },
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
    area: { ru: "Частная вилла", en: "Private villa" },
    duration: { ru: "По объёму работ", en: "Scope based" },
    images: [],
    teamIds: ["quvvat", "maruf"],
    scope: [
      { ru: "Гардеробные системы", en: "Wardrobe systems" },
      { ru: "Push-to-open с синхронизаторами", en: "Synchronized push-to-open" },
      { ru: "Монтаж и финишная регулировка", en: "Installation and final adjustment" },
    ],
    published: true,
  },
  {
    id: "dubai-hills-acacia",
    title: { ru: "Villa fit-out — Dubai Hills", en: "Villa fit-out — Dubai Hills" },
    shortTitle: { ru: "Ремонт виллы Dubai Hills", en: "Dubai Hills Villa Fit-out" },
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
    area: { ru: "Частная вилла", en: "Private villa" },
    duration: { ru: "В работе", en: "In progress" },
    images: [],
    teamIds: ["quvvat", "maruf"],
    scope: [
      { ru: "Инженерная координация", en: "Technical coordination" },
      { ru: "Отделочные работы", en: "Fit-out works" },
      { ru: "Индивидуальная мебель", en: "Bespoke furniture" },
    ],
    published: true,
  },
  {
    id: "port-de-la-mer",
    title: { ru: "Apartment renovation — Port de La Mer", en: "Apartment renovation — Port de La Mer" },
    shortTitle: { ru: "Квартира Port de La Mer", en: "Port de La Mer Apartment" },
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
    area: { ru: "Квартира", en: "Apartment" },
    duration: { ru: "В работе", en: "In progress" },
    images: [],
    teamIds: ["quvvat", "serdar"],
    scope: [
      { ru: "Building management и NOC", en: "Building management and NOC" },
      { ru: "Инженерные изменения", en: "MEP modifications" },
      { ru: "Ремонт и мебель", en: "Renovation and furniture" },
    ],
    published: true,
  },
  {
    id: "china-furniture-sourcing",
    title: { ru: "Мебель из Китая — Dubai / Foshan", en: "Furniture from China — Dubai / Foshan" },
    shortTitle: { ru: "Мебель из Китая", en: "Furniture from China" },
    district: "Dubai · Foshan",
    category: "china",
    status: "service",
    year: "2026",
    lat: 25.2048,
    lng: 55.2708,
    summary: {
      ru: "Подбор фабрик, проверка цен, образцы, контроль производства, консолидация и доставка в Дубай.",
      en: "Factory sourcing, price checks, samples, production control, consolidation and delivery to Dubai.",
    },
    area: { ru: "Для квартир, вилл и бизнеса", en: "Homes, villas and commercial" },
    duration: { ru: "По заказу", en: "Order based" },
    cover: "/media/china-furniture-photo.webp",
    images: ["/media/china-furniture-photo.webp"],
    teamIds: ["maruf", "serdar"],
    scope: [
      { ru: "Подбор и сравнение фабрик", en: "Factory sourcing and comparison" },
      { ru: "Образцы и контроль качества", en: "Samples and quality control" },
      { ru: "Консолидация и доставка", en: "Consolidation and delivery" },
    ],
    published: true,
  },
];

export const stages = [
  { number: "01", icon: "brief", title: { ru: "Бриф", en: "Brief" }, text: { ru: "Обсуждаем задачи, стиль, бюджет, сроки и формат взаимодействия.", en: "We align goals, style, budget, timeline and communication." }, result: { ru: "Зафиксированный бриф", en: "Approved project brief" } },
  { number: "02", icon: "measure", title: { ru: "Замеры", en: "Survey" }, text: { ru: "Проверяем размеры, инженерные системы и ограничения объекта.", en: "We verify dimensions, MEP systems and site constraints." }, result: { ru: "Обмерный план", en: "Measured survey" } },
  { number: "03", icon: "design", title: { ru: "Концепция", en: "Concept" }, text: { ru: "Разрабатываем планировку, материалы, свет и мебельные решения.", en: "We develop layout, materials, lighting and furniture." }, result: { ru: "Утверждённая концепция", en: "Approved concept" } },
  { number: "04", icon: "drawings", title: { ru: "Чертежи", en: "Drawings" }, text: { ru: "Готовим комплект рабочих и мебельных чертежей.", en: "We prepare construction and furniture drawings." }, result: { ru: "Рабочая документация", en: "Technical documentation" } },
  { number: "05", icon: "permit", title: { ru: "Согласования", en: "Approvals" }, text: { ru: "Координируем NOC, building management, DDA и необходимые разрешения.", en: "We coordinate NOCs, building management, DDA and permits." }, result: { ru: "Разрешение на старт", en: "Permission to start" } },
  { number: "06", icon: "build", title: { ru: "Реализация", en: "Fit-out" }, text: { ru: "Выполняем инженерные, строительные и отделочные работы.", en: "We deliver MEP, construction and finishing works." }, result: { ru: "Готовая отделка", en: "Completed fit-out" } },
  { number: "07", icon: "furniture", title: { ru: "Мебель", en: "Furniture" }, text: { ru: "Производим мебель параллельно ремонту и устанавливаем по чертежам.", en: "Furniture is produced alongside fit-out and installed to drawings." }, result: { ru: "Собранный интерьер", en: "Installed interior" } },
  { number: "08", icon: "handover", title: { ru: "Передача", en: "Handover" }, text: { ru: "Проверяем качество, закрываем замечания и передаём гарантию.", en: "We inspect, close snags and hand over the warranty." }, result: { ru: "Готовый объект", en: "Completed project" } },
];

export const team = [
  { id: "maruf", name: { ru: "Маруф Кодиров", en: "Maruf Kodirov" }, role: { ru: "Основатель · Архитектор", en: "Founder · Architect" }, image: "/media/team-maruf.webp", experience: { ru: "Архитектура, строительство, fit-out и мебель на заказ.", en: "Architecture, construction, fit-out and bespoke furniture." }, projects: ["fujairah-trade-centre", "dubai-creek-harbour", "al-furjan-villa", "china-furniture-sourcing"] },
  { id: "quvvat", name: { ru: "Кувват Худайяров", en: "Quvvat Khudayyarov" }, role: { ru: "Главный инженер", en: "Lead Engineer" }, image: "/media/team-quvvat.webp", experience: { ru: "Электрика, HVAC, электромеханика и технический контроль.", en: "Electrical, HVAC, electromechanical works and supervision." }, projects: ["fujairah-trade-centre", "dubai-hills-acacia", "al-barari-villa", "port-de-la-mer"] },
  { id: "serdar", name: { ru: "Сердар Пиркулиев", en: "Serdar Pirkuliev" }, role: { ru: "Координатор проектов", en: "Project Coordinator" }, image: "/media/team-serdar.webp", experience: { ru: "Координация работ, снабжение и контроль комплектации объектов.", en: "Site coordination, procurement and material control." }, projects: ["fujairah-trade-centre", "al-furjan-villa", "port-de-la-mer", "china-furniture-sourcing"] },
];

export const brands = [
  { name: "EGGER", logo: "/logos/brands/egger.svg" },
  { name: "Blum", logo: "/logos/brands/blum.svg" },
  { name: "Hettich", logo: "/logos/brands/hettich.svg" },
  { name: "Häfele", logo: "/logos/brands/hafele.svg" },
  { name: "REHAU", logo: "/logos/brands/rehau.svg" },
  { name: "Mapei", logo: "/logos/brands/mapei.svg" },
  { name: "Knauf", logo: "/logos/brands/knauf.svg" },
  { name: "Jotun", logo: "/logos/brands/jotun.svg" },
  { name: "Schneider Electric", logo: "/logos/brands/schneider-electric.svg" },
  { name: "Grohe", logo: "/logos/brands/grohe.svg" },
  { name: "Villeroy & Boch", logo: "/logos/brands/villeroy-boch.svg" },
  { name: "Duravit", logo: "/logos/brands/duravit.svg" },
  { name: "Teka", logo: "/logos/brands/teka.svg" },
  { name: "Geberit", logo: "/logos/brands/geberit.svg" },
  { name: "Kohler", logo: "/logos/brands/kohler.svg" },
  { name: "Roca", logo: "/logos/brands/roca.svg" },
  { name: "Siemens", logo: "/logos/brands/siemens.svg" },
  { name: "Saint-Gobain", logo: "/logos/brands/saint-gobain.svg" },
];

export const developers: Array<{ name: string; logo?: string; invert?: boolean }> = [
  { name: "EMAAR", logo: "/logos/developers/emaar.svg" },
  { name: "NAKHEEL", logo: "/logos/developers/nakheel.svg" },
  { name: "MERAAS", logo: "/logos/developers/meraas.svg" },
  { name: "DAMAC", logo: "/logos/developers/damac.svg" },
  { name: "SOBHA", logo: "/logos/developers/sobha.svg", invert: true },
  { name: "DUBAI PROPERTIES", logo: "/logos/developers/dubai-properties.svg" },
  { name: "ELLINGTON", logo: "/logos/developers/ellington.png" },
  { name: "AZIZI", logo: "/logos/developers/azizi.svg" },
  { name: "BINGHATTI", logo: "/logos/developers/binghatti.svg" },
  { name: "DANUBE", logo: "/logos/developers/danube.svg" },
  { name: "WASL", logo: "/logos/developers/wasl.png", invert: true },
  { name: "SELECT GROUP", logo: "/logos/developers/select-group.svg" },
];
