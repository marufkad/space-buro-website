export type Lang = "ru" | "en";
export type Localized = { ru: string; en: string };
export type ProjectCategory = "renovation" | "furniture" | "residential" | "commercial" | "china" | "architecture";
export type ProjectMapType = ProjectCategory;

export type ProjectLocation = {
  id: string;
  title: Localized;
  shortTitle: Localized;
  district: string;
  category: ProjectCategory;
  categories: ProjectCategory[];
  mapType: ProjectMapType;
  status: "completed" | "progress" | "service";
  year: string;
  lat: number;
  lng: number;
  summary: Localized;
  area: Localized;
  duration: Localized;
  cover?: string;
  coverImages?: string[];
  images: string[];
  beforeImages?: string[];
  beforeLabel?: Localized;
  materials?: string[];
  teamIds: string[];
  scope: Localized[];
  published: boolean;
};

export const fujairahImages = [
  "/media/project-fujairah-01.webp",
  "/media/project-fujairah-02.webp",
  "/media/project-fujairah-03.webp",
  "/media/project-fujairah-04.webp",
  ...Array.from({ length: 12 }, (_, index) =>
    `/media/projects/fujairah-office/gallery/${String(index + 1).padStart(2, "0")}-${[
      "dsc-9137",
      "dsc-9158",
      "dsc-9163",
      "dsc-9234",
      "dsc-9283",
      "dsc-9296",
      "dsc-9303",
      "dsc-9317",
      "dsc-9391",
      "dsc-9408",
      "dsc-9460",
      "dsc-9557",
    ][index]}.webp`,
  ),
];

export const fujairahBeforeImages = Array.from(
  { length: 4 },
  (_, index) => `/media/projects/fujairah-office/before/${String(index + 1).padStart(2, "0")}-before.webp`,
);

export const seventhHeavenFinishedImages = Array.from(
  { length: 10 },
  (_, index) => `/media/projects/seventh-heaven/gallery/${String(index + 1).padStart(2, "0")}-finished.webp`,
);

export const seventhHeavenBeforeImages = Array.from(
  { length: 4 },
  (_, index) => `/media/projects/seventh-heaven/before/${String(index + 1).padStart(2, "0")}-before.webp`,
);

const projectImages = (slug: string, count: number, folder = "gallery") =>
  Array.from({ length: count }, (_, index) =>
    `/media/projects/${slug}/${folder}/${String(index + 1).padStart(2, "0")}.webp`,
  );

export const alBateenMainImages = projectImages("al-bateen-residence", 28);
export const alBateenBeforeImages = projectImages("al-bateen-residence", 9, "before");
export const sadafImages = projectImages("sadaf-8-jbr", 6);
export const sadafBeforeImages = projectImages("sadaf-8-jbr", 6, "before");
export const elementalMainImages = projectImages("elemental-day-surgery-clinic", 12);
export const elementalProgressImages = projectImages("elemental-day-surgery-clinic", 6, "before");
export const alFurjanImages = projectImages("al-furjan-villa", 21);
export const vostokImages = projectImages("office-vostok-real-estate", 8);

function createMapOnlyProject({
  id,
  title,
  shortTitle,
  district,
  categories,
  mapType,
  lat,
  lng,
}: Pick<ProjectLocation, "id" | "title" | "shortTitle" | "district" | "categories" | "mapType" | "lat" | "lng">): ProjectLocation {
  return {
    id,
    title,
    shortTitle,
    district,
    category: mapType,
    categories,
    mapType,
    status: "progress",
    year: "2026",
    lat,
    lng,
    summary: {
      ru: "Локация проекта добавлена на карту. Фотографии и подробности объекта будут опубликованы следующим обновлением.",
      en: "The project location is now on the map. Photography and project details will be published in the next update.",
    },
    area: { ru: "Данные готовятся", en: "Details coming soon" },
    duration: { ru: "Данные готовятся", en: "Details coming soon" },
    images: [],
    teamIds: [],
    scope: [],
    published: false,
  };
}

export const projectLocations: ProjectLocation[] = [
  {
    id: "fujairah-trade-centre",
    title: { ru: "Office fit-out — Fujairah Trade Centre", en: "Office fit-out — Fujairah Trade Centre" },
    shortTitle: { ru: "Офис Fujairah Trade Centre", en: "Fujairah Trade Centre Office" },
    district: "Fujairah",
    category: "commercial",
    mapType: "commercial",
    categories: ["commercial", "furniture", "renovation"],
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
    cover: fujairahImages[4],
    coverImages: fujairahImages.slice(4),
    images: [...fujairahImages, ...fujairahBeforeImages],
    beforeImages: fujairahBeforeImages,
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
    id: "seventh-heaven-al-barari",
    title: { ru: "Seventh Heaven, Al Barari", en: "Seventh Heaven, Al Barari" },
    shortTitle: { ru: "Seventh Heaven, Al Barari", en: "Seventh Heaven, Al Barari" },
    district: "Seventh Heaven · Al Barari",
    category: "furniture",
    mapType: "furniture",
    categories: ["furniture", "residential"],
    status: "completed",
    year: "2026",
    lat: 25.099081,
    lng: 55.316783,
    summary: {
      ru: "Полная мебелировка квартиры",
      en: "Complete apartment furnishing.",
    },
    area: { ru: "80 м²", en: "80 m²" },
    duration: { ru: "1 месяц", en: "1 month" },
    cover: seventhHeavenFinishedImages[0],
    coverImages: seventhHeavenFinishedImages,
    images: [...seventhHeavenFinishedImages, ...seventhHeavenBeforeImages],
    beforeImages: seventhHeavenBeforeImages,
    materials: ["EGGER", "Blum"],
    teamIds: ["maruf", "serdar"],
    scope: [
      { ru: "Проектирование мебели под индивидуальный дизайн", en: "Bespoke furniture design" },
      { ru: "Изготовление и монтаж мебели", en: "Furniture production and installation" },
      { ru: "Мебель для гостиной зоны и TV-unit", en: "Living area furniture and TV unit" },
      { ru: "Мебель для спальни и санузла", en: "Bedroom and bathroom furniture" },
    ],
    published: true,
  },
  {
    id: "dubai-creek-harbour",
    title: { ru: "Apartment & furniture — Creek Harbour", en: "Apartment & furniture — Creek Harbour" },
    shortTitle: { ru: "Квартира Creek Harbour", en: "Creek Harbour Apartment" },
    district: "Dubai Creek Harbour",
    category: "furniture",
    mapType: "furniture",
    categories: ["residential", "furniture"],
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
    title: { ru: "Полный fit-out — вилла Al Furjan", en: "Full fit-out — Al Furjan Villa" },
    shortTitle: { ru: "Вилла Al Furjan", en: "Al Furjan Villa" },
    district: "Al Furjan, Dubai",
    category: "renovation",
    mapType: "renovation",
    categories: ["furniture", "residential", "renovation"],
    status: "completed",
    year: "2025",
    lat: 25.02671,
    lng: 55.14699,
    summary: {
      ru: "Полный fit-out виллы: от дизайна и рабочей документации до инженерных работ, отделки и полной меблировки.",
      en: "A complete villa fit-out, from design and documentation to engineering, finishes and full furnishing.",
    },
    area: { ru: "350 м²", en: "350 m²" },
    duration: { ru: "6 месяцев", en: "6 months" },
    cover: alFurjanImages[0],
    coverImages: alFurjanImages,
    images: alFurjanImages,
    teamIds: ["maruf", "quvvat", "serdar"],
    scope: [
      { ru: "Дизайн, рабочая документация и визуализация", en: "Design, project documentation and visualisation" },
      { ru: "Покраска и отделочные работы", en: "Painting and finishing works" },
      { ru: "Сантехника и электрика", en: "Plumbing and electrical works" },
      { ru: "Полная меблировка виллы", en: "Complete villa furnishing" },
    ],
    published: true,
  },
  {
    id: "port-de-la-mer",
    title: { ru: "Le Ciel Tower 1 — Port de La Mer", en: "Le Ciel Tower 1 — Port de La Mer" },
    shortTitle: { ru: "Le Ciel Tower 1", en: "Le Ciel Tower 1" },
    district: "Port de La Mer",
    category: "renovation",
    mapType: "renovation",
    categories: ["renovation", "furniture", "residential"],
    status: "progress",
    year: "2026",
    lat: 25.2355173,
    lng: 55.2525428,
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
  createMapOnlyProject({
    id: "damac-hills-2-kitchen",
    title: { ru: "Kitchen — DAMAC Hills 2", en: "Kitchen — DAMAC Hills 2" },
    shortTitle: { ru: "Кухня DAMAC Hills 2", en: "DAMAC Hills 2 Kitchen" },
    district: "DAMAC Hills 2",
    categories: ["residential", "furniture"],
    mapType: "furniture",
    lat: 24.98758,
    lng: 55.38479,
  }),
  createMapOnlyProject({
    id: "azizi-riviera",
    title: { ru: "Azizi Riviera", en: "Azizi Riviera" },
    shortTitle: { ru: "Azizi Riviera", en: "Azizi Riviera" },
    district: "Meydan · MBR City",
    categories: ["renovation", "furniture", "residential"],
    mapType: "renovation",
    lat: 25.1728605,
    lng: 55.3055647,
  }),
  createMapOnlyProject({
    id: "springs-10",
    title: { ru: "Villa — Springs 10", en: "Villa — Springs 10" },
    shortTitle: { ru: "Вилла Springs 10", en: "Springs 10 Villa" },
    district: "The Springs 10",
    categories: ["furniture", "residential"],
    mapType: "furniture",
    lat: 25.05778,
    lng: 55.18112,
  }),
  createMapOnlyProject({
    id: "harmony-1-tilal-al-ghaf",
    title: { ru: "Villa — Harmony 1", en: "Villa — Harmony 1" },
    shortTitle: { ru: "Вилла Harmony 1", en: "Harmony 1 Villa" },
    district: "Tilal Al Ghaf",
    categories: ["furniture", "residential", "renovation"],
    mapType: "renovation",
    lat: 25.0229375,
    lng: 55.2305781,
  }),
  createMapOnlyProject({
    id: "bluewaters-residence-8",
    title: { ru: "Bluewaters Residences — Building 8", en: "Bluewaters Residences — Building 8" },
    shortTitle: { ru: "Bluewaters 8", en: "Bluewaters 8" },
    district: "Bluewaters Island",
    categories: ["residential", "furniture"],
    mapType: "residential",
    lat: 25.0783625,
    lng: 55.1223906,
  }),
  createMapOnlyProject({
    id: "jumeirah-golf-estates-villa",
    title: { ru: "Villa — Jumeirah Golf Estates", en: "Villa — Jumeirah Golf Estates" },
    shortTitle: { ru: "Вилла Golf Estates", en: "Golf Estates Villa" },
    district: "Jumeirah Golf Estates",
    categories: ["furniture", "residential"],
    mapType: "furniture",
    lat: 25.0208974,
    lng: 55.1995132,
  }),
  createMapOnlyProject({
    id: "bayshore-1-creek-beach",
    title: { ru: "Bayshore 1 — Creek Beach", en: "Bayshore 1 — Creek Beach" },
    shortTitle: { ru: "Bayshore 1", en: "Bayshore 1" },
    district: "Dubai Creek Beach",
    categories: ["furniture", "residential"],
    mapType: "furniture",
    lat: 25.20133,
    lng: 55.34859,
  }),
  createMapOnlyProject({
    id: "sidra-1-dubai-hills",
    title: { ru: "Villa — Sidra 1, Dubai Hills", en: "Villa — Sidra 1, Dubai Hills" },
    shortTitle: { ru: "Вилла Sidra 1", en: "Sidra 1 Villa" },
    district: "Dubai Hills Estate",
    categories: ["furniture", "residential"],
    mapType: "furniture",
    lat: 25.09371,
    lng: 55.24765,
  }),
  {
    id: "al-bateen-residences-jbr",
    title: { ru: "Al Bateen Residence 1 — полный fit-out", en: "Al Bateen Residence 1 — full fit-out" },
    shortTitle: { ru: "Al Bateen Residence 1", en: "Al Bateen Residence 1" },
    district: "Dubai · JBR · Al Bateen Residence",
    category: "renovation",
    mapType: "renovation",
    categories: ["renovation", "furniture", "residential"],
    status: "progress",
    year: "2026",
    lat: 25.0728125,
    lng: 55.1280625,
    summary: {
      ru: "Полный fit-out квартиры: дизайн, согласования, новая инженерия, отделка и мебель на заказ с производством в Китае.",
      en: "A full apartment fit-out covering design, approvals, new engineering systems, finishes and custom furniture sourced from China.",
    },
    area: { ru: "120 м²", en: "120 m²" },
    duration: { ru: "6 месяцев", en: "6 months" },
    cover: alBateenMainImages[0],
    coverImages: alBateenMainImages,
    images: alBateenMainImages,
    beforeImages: alBateenBeforeImages,
    teamIds: ["maruf", "quvvat", "serdar"],
    scope: [
      { ru: "Дизайн, документация и визуализация", en: "Design, documentation and visualisation" },
      { ru: "Согласования и сертификация", en: "Approvals and certifications" },
      { ru: "Полный комплекс инженерных и отделочных работ", en: "Complete engineering and finishing works" },
      { ru: "Новые системы электрики, сантехники и HVAC", en: "Entirely new electrical, plumbing and HVAC systems" },
      { ru: "Мебель на заказ с производством в Китае", en: "Custom furniture sourced from China" },
    ],
    published: true,
  },
  {
    id: "sadaf-8-jbr",
    title: { ru: "Sadaf 8, JBR — дизайн и мебель", en: "Sadaf 8, JBR — design and furniture" },
    shortTitle: { ru: "Sadaf 8, JBR", en: "Sadaf 8, JBR" },
    district: "Dubai · JBR · Sadaf 8",
    category: "furniture",
    mapType: "furniture",
    categories: ["furniture", "residential"],
    status: "progress",
    year: "2026",
    lat: 25.0782,
    lng: 55.1345,
    summary: {
      ru: "Дизайн квартиры, проектная документация, визуализация и полный комплекс мебельных работ.",
      en: "Apartment design, project documentation, visualisation and complete furniture works throughout the home.",
    },
    area: { ru: "135 м²", en: "135 m²" },
    duration: { ru: "2 месяца", en: "2 months" },
    cover: sadafImages[0],
    coverImages: sadafImages,
    images: sadafImages,
    beforeImages: sadafBeforeImages,
    beforeLabel: { ru: "До начала работ и ход проекта", en: "Before and work in progress" },
    teamIds: ["maruf", "quvvat", "serdar"],
    scope: [
      { ru: "Дизайн и визуализация", en: "Design and visualisation" },
      { ru: "Проектная документация", en: "Project documentation" },
      { ru: "Мебель для всей квартиры", en: "Furniture throughout the apartment" },
    ],
    published: true,
  },
  {
    id: "elemental-day-surgery-clinic",
    title: { ru: "Elemental Day Surgery Clinic, Jumeirah", en: "Elemental Day Surgery Clinic, Jumeirah" },
    shortTitle: { ru: "Клиника Elemental, Jumeirah", en: "Elemental Clinic, Jumeirah" },
    district: "Dubai · Jumeirah",
    category: "architecture",
    mapType: "architecture",
    categories: ["architecture", "commercial"],
    status: "progress",
    year: "2026",
    lat: 25.2157,
    lng: 55.2537,
    summary: {
      ru: "Архитектурное и конструктивное решение кровли клиники с расчётом, изготовлением и монтажом металлокаркаса и облицовки.",
      en: "Architectural and structural roof design for the clinic, including calculations, fabrication, installation and metal cladding.",
    },
    area: { ru: "400 м²", en: "400 m²" },
    duration: { ru: "5 месяцев", en: "5 months" },
    cover: elementalMainImages[0],
    coverImages: elementalMainImages,
    images: elementalMainImages,
    beforeImages: elementalProgressImages,
    beforeLabel: { ru: "Ход работ", en: "Work in progress" },
    teamIds: ["maruf", "quvvat", "serdar"],
    scope: [
      { ru: "Архитектурное проектирование здания и кровли", en: "Architectural and roof design" },
      { ru: "Конструктивные и металлокаркасные расчёты", en: "Structural and metal-frame calculations" },
      { ru: "Изготовление и монтаж металлокаркаса кровли и перекрытий", en: "Fabrication and execution of roof framing and structural overlaps" },
      { ru: "Облицовка металлом и нержавеющей сталью золотого оттенка", en: "Gold-tone stainless-steel and metal cladding" },
    ],
    published: true,
  },
  {
    id: "office-vostok-real-estate",
    title: { ru: "Офис Vostok Real Estate", en: "Vostok Real Estate Office" },
    shortTitle: { ru: "Vostok Real Estate", en: "Vostok Real Estate" },
    district: "Dubai Internet City",
    category: "commercial",
    mapType: "commercial",
    categories: ["commercial", "furniture"],
    status: "completed",
    year: "2026",
    lat: 25.0961,
    lng: 55.1583,
    summary: {
      ru: "Компактный офис с фирменной ресепшен-зоной, переговорной, рабочими местами и встроенной мебелью. Продуманное хранение, мини-кухня и интегрированный свет эффективно используют каждый метр.",
      en: "A compact office with a branded reception, meeting room, manager and team workstations, custom storage and kitchenette furniture. Integrated lighting and a disciplined layout make every square metre work efficiently.",
    },
    area: { ru: "60 м²", en: "60 m²" },
    duration: { ru: "1,5 месяца", en: "1.5 months" },
    cover: vostokImages[0],
    coverImages: vostokImages,
    images: vostokImages,
    teamIds: ["maruf", "quvvat", "serdar"],
    scope: [
      { ru: "Брендированная ресепшен-зона и переговорная", en: "Branded reception and meeting room" },
      { ru: "Кабинет руководителя и рабочие места", en: "Manager office and team workstations" },
      { ru: "Системы хранения, мини-кухня и мебель на заказ", en: "Custom storage, kitchenette and furniture" },
      { ru: "Интегрированное освещение и компактная планировка", en: "Integrated lighting and efficient compact planning" },
    ],
    published: true,
  },
  {
    id: "china-furniture-sourcing",
    title: { ru: "Мебель из Китая — Dubai / Foshan", en: "Furniture from China — Dubai / Foshan" },
    shortTitle: { ru: "Мебель из Китая", en: "Furniture from China" },
    district: "Dubai · Foshan",
    category: "china",
    mapType: "china",
    categories: ["china"],
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
    cover: "/media/china-furniture-concept.webp",
    images: ["/media/china-furniture-concept.webp"],
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
  { number: "01", icon: "brief", image: "/media/stages/01-brief.webp", title: { ru: "Бриф", en: "Brief" }, text: { ru: "Обсуждаем задачи, стиль, бюджет, сроки и формат взаимодействия.", en: "We align goals, style, budget, timeline and communication." }, result: { ru: "Зафиксированный бриф", en: "Approved project brief" } },
  { number: "02", icon: "measure", image: "/media/stages/02-measurements.webp", title: { ru: "Замеры", en: "Survey" }, text: { ru: "Проверяем размеры, инженерные системы и ограничения объекта.", en: "We verify dimensions, MEP systems and site constraints." }, result: { ru: "Обмерный план", en: "Measured survey" } },
  { number: "03", icon: "design", image: "/media/stages/03-concept.webp", title: { ru: "Концепция", en: "Concept" }, text: { ru: "Разрабатываем планировку, материалы, свет и мебельные решения.", en: "We develop layout, materials, lighting and furniture." }, result: { ru: "Утверждённая концепция", en: "Approved concept" } },
  { number: "04", icon: "drawings", image: "/media/stages/04-drawings.webp", title: { ru: "Чертежи", en: "Drawings" }, text: { ru: "Готовим комплект рабочих и мебельных чертежей.", en: "We prepare construction and furniture drawings." }, result: { ru: "Рабочая документация", en: "Technical documentation" } },
  { number: "05", icon: "permit", image: "/media/stages/05-approvals.webp", title: { ru: "Согласования", en: "Approvals" }, text: { ru: "Координируем NOC, building management, DDA и необходимые разрешения.", en: "We coordinate NOCs, building management, DDA and permits." }, result: { ru: "Разрешение на старт", en: "Permission to start" } },
  { number: "06", icon: "build", image: "/media/stages/06-implementation.webp", title: { ru: "Реализация", en: "Fit-out" }, text: { ru: "Выполняем инженерные, строительные и отделочные работы.", en: "We deliver MEP, construction and finishing works." }, result: { ru: "Готовая отделка", en: "Completed fit-out" } },
  { number: "07", icon: "furniture", image: "/media/stages/07-furniture.webp", title: { ru: "Мебель", en: "Furniture" }, text: { ru: "Производим мебель параллельно ремонту и устанавливаем по чертежам.", en: "Furniture is produced alongside fit-out and installed to drawings." }, result: { ru: "Собранный интерьер", en: "Installed interior" } },
  { number: "08", icon: "handover", image: "/media/stages/08-handover.webp", title: { ru: "Передача", en: "Handover" }, text: { ru: "Проверяем качество, закрываем замечания и передаём гарантию.", en: "We inspect, close snags and hand over the warranty." }, result: { ru: "Готовый объект", en: "Completed project" } },
];

export const team = [
  { id: "maruf", name: { ru: "Маруф Кодиров", en: "Maruf Kodirov" }, role: { ru: "Основатель · Архитектор", en: "Founder · Architect" }, image: "/media/team-maruf.webp", experience: { ru: "Более 5 лет работает в архитектуре, строительстве вилл, fit-out и ремонте помещений, развивает направление мебели на заказ. Выпускник Белорусского национального технического университета по специальности «Архитектура». Отвечает за концепцию, планировку и целостность реализации проекта.", en: "Over five years of experience across architecture, villa construction, fit-out, renovation and bespoke furniture. A graduate of the Belarusian National Technical University in Architecture, Maruf leads concepts, planning and the overall integrity of project delivery." } },
  { id: "quvvat", name: { ru: "Кувват Худайяров", en: "Quvvat Khudayyarov" }, role: { ru: "Главный инженер", en: "Lead Engineer" }, image: "/media/team-quvvat.webp", experience: { ru: "Более 8 лет занимается системами кондиционирования, электромонтажными и электромеханическими работами. Контролирует инженерные решения, качество монтажа и технический надзор на строительных объектах.", en: "More than eight years of experience in air-conditioning, electrical and electromechanical systems. Quvvat oversees engineering decisions, installation quality and technical supervision across construction sites." } },
  { id: "serdar", name: { ru: "Сердар Пиркулиев", en: "Serdar Pirkuliev" }, role: { ru: "Координатор проектов", en: "Project Coordinator" }, image: "/media/team-serdar.webp", experience: { ru: "Более 12 лет работает в строительстве и архитектуре, включая практику в Дубае в области fit-out, ремонта и мебели на заказ. Выпускник Харьковского национального университета городского хозяйства по специальности «Строительство». Координирует площадку, снабжение и сроки.", en: "More than twelve years in construction and architecture, including Dubai experience in fit-out, renovation and bespoke furniture. A Construction graduate of O. M. Beketov National University, Serdar coordinates site activity, procurement and schedules." } },
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
  { name: "Legrand", logo: "/logos/brands/legrand.svg" },
  { name: "Grohe", logo: "/logos/brands/grohe.svg" },
  { name: "Geberit", logo: "/logos/brands/geberit.svg" },
  { name: "Kohler", logo: "/logos/brands/kohler.svg" },
  { name: "Roca", logo: "/logos/brands/roca.svg" },
  { name: "Siemens", logo: "/logos/brands/siemens.svg" },
  { name: "Saint-Gobain", logo: "/logos/brands/saint-gobain.svg" },
];

export const developers: Array<{ id: string; name: string; label?: Localized; logo?: string; invert?: boolean }> = [
  { id: "emaar", name: "EMAAR", logo: "/logos/developers/emaar.svg" },
  { id: "nakheel", name: "NAKHEEL", logo: "/logos/developers/nakheel.svg", invert: true },
  { id: "meraas", name: "MERAAS", logo: "/logos/developers/meraas.svg" },
  { id: "damac", name: "DAMAC", logo: "/logos/developers/damac.svg" },
  { id: "sobha", name: "SOBHA", logo: "/logos/developers/sobha.svg" },
  { id: "dubai-properties", name: "DUBAI PROPERTIES", logo: "/logos/developers/dubai-properties-v2.png" },
  { id: "deyaar", name: "DEYAAR", logo: "/logos/developers/deyaar.svg" },
  { id: "azizi", name: "AZIZI", logo: "/logos/developers/azizi.png" },
  { id: "binghatti", name: "BINGHATTI", logo: "/logos/developers/binghatti.svg", invert: true },
  { id: "danube", name: "DANUBE PROPERTIES", logo: "/logos/developers/danube.png" },
  { id: "omniyat", name: "OMNIYAT", logo: "/logos/developers/omniyat-brand.webp" },
  { id: "others", name: "AND OTHERS", label: { ru: "И ДРУГИЕ", en: "AND OTHERS" } },
];
