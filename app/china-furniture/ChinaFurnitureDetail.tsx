"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Lang } from "../data";

const copy = {
  ru: {
    back: "Вернуться на сайт", kicker: "Dubai · Foshan", title: "Мебель из Китая — управляемая комплектация, а не случайная закупка",
    intro: "Собираем ведомость, сравниваем фабрики и контролируем путь заказа до доставки в ОАЭ. Услуга подходит для квартир, вилл, офисов и коммерческих пространств.",
    cta: "Отправить задачу", stepsTitle: "Как проходит заказ", termsTitle: "Условия и ориентировочные сроки",
    steps: [
      ["01", "Бриф и ведомость", "Фиксируем помещения, размеры, количество позиций, стиль, материалы и бюджет."],
      ["02", "Подбор фабрик", "Собираем предложения и сравниваем цену, сроки, материалы, MOQ и возможности кастомизации."],
      ["03", "Образцы", "Проверяем ткани, шпон, камень, металл, фурнитуру и согласовываем эталон."],
      ["04", "Спецификация и оплата", "Утверждаем комплектацию, размеры, цвета, стоимость, график и условия каждой фабрики."],
      ["05", "Контроль производства", "Сверяем ключевые этапы с утверждённой спецификацией и собираем фотоотчёты."],
      ["06", "Инспекция", "До отправки проверяем количество, внешний вид, размеры и упаковку."],
      ["07", "Консолидация и доставка", "Объединяем позиции, готовим груз и координируем логистику до ОАЭ."],
      ["08", "Приёмка и установка", "Проверяем поставку на месте и координируем сборку и расстановку."],
    ],
    terms: [
      ["7–14 дней", "Предварительный подбор и сравнение фабрик после готовой ведомости."],
      ["1–3 недели", "Согласование образцов и финальной спецификации — зависит от кастомизации."],
      ["30–60 дней", "Ориентир производства; точный срок фиксируется фабрикой в заказе."],
      ["Индивидуально", "Доставка, таможенные расходы и монтаж рассчитываются после объёма и упаковочного листа."],
    ],
    includedTitle: "Что контролирует Space Buro", included: ["Ведомость и единая спецификация", "Сравнение предложений", "Коммуникация с фабриками", "Образцы и фотоотчёты", "Инспекция и упаковка", "Доставка и координация монтажа"],
    note: "Сроки приведены для планирования и не являются офертой. Финальные условия зависят от фабрики, объёма, кастомизации и способа доставки.",
  },
  en: {
    back: "Back to website", kicker: "Dubai · Foshan", title: "Furniture from China — controlled furnishing, not random purchasing",
    intro: "We build the schedule, compare factories and control the order through UAE delivery. Suitable for apartments, villas, offices and commercial spaces.",
    cta: "Send your brief", stepsTitle: "How the order works", termsTitle: "Terms and planning timelines",
    steps: [
      ["01", "Brief and schedule", "We define rooms, dimensions, quantities, style, materials and budget."],
      ["02", "Factory sourcing", "Offers are compared by price, timing, materials, MOQ and customisation."],
      ["03", "Samples", "Fabrics, veneer, stone, metal and hardware are reviewed and approved."],
      ["04", "Specification and payment", "Items, dimensions, colours, costs, schedule and factory terms are confirmed."],
      ["05", "Production control", "Key stages are checked against the approved specification with photo reports."],
      ["06", "Inspection", "Quantity, appearance, dimensions and packaging are checked before dispatch."],
      ["07", "Consolidation and delivery", "Orders are consolidated and logistics to the UAE are coordinated."],
      ["08", "Acceptance and installation", "Delivery is checked on site and assembly is coordinated."],
    ],
    terms: [
      ["7–14 days", "Initial factory sourcing after the furniture schedule is ready."],
      ["1–3 weeks", "Samples and final specification, depending on customisation."],
      ["30–60 days", "Typical production planning range; the factory confirms the final schedule."],
      ["Project based", "Delivery, customs and installation follow the volume and packing list."],
    ],
    includedTitle: "What Space Buro controls", included: ["Furniture schedule and specification", "Offer comparison", "Factory communication", "Samples and photo reporting", "Inspection and packaging", "Delivery and installation coordination"],
    note: "Timelines are planning guidance, not an offer. Final terms depend on the factory, volume, customisation and delivery method.",
  },
} as const;

export default function ChinaFurnitureDetail() {
  const [lang, setLang] = useState<Lang>("ru");
  const t = copy[lang];

  return <main className="china-detail-page">
    <header className="detail-header"><Link className="logo" href="/"><span>SPACE</span><span>BURO</span></Link><Link href="/#china">← {t.back}</Link><div><button type="button" onClick={() => setLang(lang === "ru" ? "en" : "ru")}>{lang === "ru" ? "EN" : "RU"}</button><a href="https://wa.me/971523569697" target="_blank" rel="noreferrer">WA</a><a href="https://t.me/marufkad" target="_blank" rel="noreferrer">TG</a></div></header>
    <section className="china-detail-hero"><div><p className="eyebrow">{t.kicker}</p><h1>{t.title}</h1><p>{t.intro}</p><a className="button button-primary" href="https://wa.me/971523569697" target="_blank" rel="noreferrer">{t.cta}<span>↗</span></a></div><figure><Image src="/media/china-furniture-photo.webp" alt={t.title} fill sizes="(max-width: 900px) 100vw, 55vw" priority /><figcaption>Photo: Collov Home Design / Unsplash</figcaption></figure></section>
    <section className="china-detail-process"><div className="detail-section-title"><p className="eyebrow">01—08</p><h2>{t.stepsTitle}</h2></div><div>{t.steps.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="china-detail-terms"><div><p className="eyebrow">Planning</p><h2>{t.termsTitle}</h2><p>{t.note}</p></div><div>{t.terms.map(([time, text]) => <article key={time}><strong>{time}</strong><p>{text}</p></article>)}</div></section>
    <section className="china-detail-included"><div><p className="eyebrow">Space Buro</p><h2>{t.includedTitle}</h2></div><ol>{t.included.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>)}</ol></section>
    <section className="detail-next"><a className="button button-primary" href="https://wa.me/971523569697" target="_blank" rel="noreferrer">{t.cta}<span>↗</span></a><Link href="/#china"><span>{t.back}</span><strong>Space Buro</strong><b>→</b></Link></section>
  </main>;
}
