import type { Localized } from "./data";
export const projectBriefs: Record<string, Localized> = {
  "fujairah-trade-centre": {ru:"Подготовить офис площадью 330 м² к работе: объединить инженерные системы, отделку и мебель в одном проекте.",en:"Prepare a 330 m² office for use, bringing building services, finishes and furniture into one coordinated project."},
  "seventh-heaven-al-barari": {ru:"Меблировать квартиру площадью 80 м² в соответствии с индивидуальным дизайном.",en:"Furnish an 80 m² apartment to a bespoke design."},
  "al-furjan-villa": {ru:"Выполнить ремонт и полную меблировку жилой виллы площадью 350 м².",en:"Renovate and fully furnish a 350 m² residential villa."},
  "al-bateen-residences-jbr": {ru:"Полностью обновить квартиру площадью 120 м² в JBR: от дизайна и согласований до новых инженерных систем и мебели на заказ.",en:"Completely renovate a 120 m² apartment in JBR, from design and approvals to new building services and bespoke furniture."},
  "sadaf-8-jbr": {ru:"Разработать дизайн и мебельные решения для всей квартиры площадью 135 м² в Sadaf 8, JBR.",en:"Develop design and furniture solutions for a 135 m² apartment in Sadaf 8, JBR."},
  "elemental-day-surgery-clinic": {ru:"Разработать и реализовать архитектурное и конструктивное решение кровли клиники в Джумейре.",en:"Design and build the clinic’s architectural and structural roof solution in Jumeirah."},
  "office-vostok-real-estate": {ru:"Выполнить мебельное оснащение офиса Vostok Real Estate площадью 60 м² в Dubai Internet City.",en:"Provide furniture for Vostok Real Estate’s 60 m² office in Dubai Internet City."},
};

type CasePresentation = {
  title: string;
  subtitle: Localized;
  category: Localized;
  heading: Localized;
};

// Editorial headings describe the same scope as data.ts; facts stay in that
// shared project record so cards, maps and case studies cannot drift apart.
export const casePresentations: Record<string, CasePresentation> = {
  "fujairah-trade-centre": {
    title: "Fujairah Trade Centre",
    subtitle: { ru: "Офис в Фуджейре", en: "Office in Fujairah" },
    category: { ru: "Коммерческий проект / Полный fit-out", en: "Commercial project / Full fit-out" },
    heading: { ru: "От проекта до готового офиса.", en: "From the brief to a finished office." },
  },
  "seventh-heaven-al-barari": {
    title: "Seventh Heaven",
    subtitle: { ru: "Квартира в Al Barari", en: "Apartment in Al Barari" },
    category: { ru: "Жилой проект / Мебель на заказ", en: "Residential project / Custom furniture" },
    heading: { ru: "Мебель под характер пространства.", en: "Furniture shaped around the space." },
  },
  "al-furjan-villa": {
    title: "Al Furjan",
    subtitle: { ru: "Вилла в Дубае", en: "Villa in Dubai" },
    category: { ru: "Жилая вилла / Полный fit-out", en: "Residential villa / Full fit-out" },
    heading: { ru: "От идеи до готового дома.", en: "From the first idea to a finished home." },
  },
  "al-bateen-residences-jbr": {
    title: "Al Bateen",
    subtitle: { ru: "Residence 1 · Квартира в JBR", en: "Residence 1 · Apartment in JBR" },
    category: { ru: "Жилой проект / Полный fit-out", en: "Residential project / Full fit-out" },
    heading: { ru: "Полное обновление жилого пространства.", en: "A complete transformation of a home." },
  },
  "sadaf-8-jbr": {
    title: "Sadaf 8",
    subtitle: { ru: "Квартира в JBR", en: "Apartment in JBR" },
    category: { ru: "Жилой проект / Дизайн и мебель", en: "Residential project / Design and furniture" },
    heading: { ru: "Проектируем мебель для жизни.", en: "Designing furniture for everyday life." },
  },
  "elemental-day-surgery-clinic": {
    title: "Elemental",
    subtitle: { ru: "Day Surgery Clinic · Jumeirah", en: "Day Surgery Clinic · Jumeirah" },
    category: { ru: "Архитектура / Коммерческий проект", en: "Architecture / Commercial project" },
    heading: { ru: "Архитектура и конструкция кровли.", en: "Roof architecture and structure." },
  },
  "office-vostok-real-estate": {
    title: "Vostok Real Estate",
    subtitle: { ru: "Офис в Dubai Internet City", en: "Office in Dubai Internet City" },
    category: { ru: "Коммерческий проект / Мебель на заказ", en: "Commercial project / Custom furniture" },
    heading: { ru: "Каждый метр работает на команду.", en: "Making every metre work for the team." },
  },
};
