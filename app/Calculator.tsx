"use client";

import { useMemo, useState } from "react";
import type { Lang } from "./data";
import ResponsiveArrow from "./ResponsiveArrow";
import { whatsapp } from "./site";

type CalculatorType = "renovation" | "furniture";
type PropertyType = "apartment" | "villa" | "commercial";
type FurnitureLevel = "standard" | "premium";

const ui = {
  ru: {
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
    estimateNote: "Согласования и индивидуальные позиции рассчитываются отдельно. Финальная цена зависит от объекта и спецификации.",
    calcCta: "Уточнить расчёт",
  },
  en: {
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
  },
} as const;

function formatAed(value: number, lang: Lang) {
  return new Intl.NumberFormat(lang === "ru" ? "ru-RU" : "en-AE", { maximumFractionDigits: 0 }).format(Math.round(value / 1000) * 1000);
}

export default function Calculator({ lang, headingLevel = "h2" }: { lang: Lang; headingLevel?: "h1" | "h2" }) {
  const [calculatorType, setCalculatorType] = useState<CalculatorType>("renovation");
  const [area, setArea] = useState(100);
  const [propertyType, setPropertyType] = useState<PropertyType>("apartment");
  const [renovationLevel, setRenovationLevel] = useState<"cosmetic" | "standard" | "premium">("standard");
  const [furnitureMeters, setFurnitureMeters] = useState(12);
  const [furnitureLevel, setFurnitureLevel] = useState<FurnitureLevel>("standard");
  const [includeVat, setIncludeVat] = useState(false);
  const [estimateMessage, setEstimateMessage] = useState("");
  const t = ui[lang];
  const Heading = headingLevel;

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

  function contactEstimate() {
    const configuration = calculatorType === "renovation"
      ? `${t.propertyTypes[propertyType]}, ${t.levels[renovationLevel]}, ${area} m²`
      : `${t.furnitureLevels[furnitureLevel]}, ${furnitureMeters} m`;
    const message = lang === "ru"
      ? `Здравствуйте! Хочу уточнить предварительный расчёт: ${t.calcTabs[calculatorType]}, ${configuration}, AED ${formatAed(estimate[0], lang)}–${formatAed(estimate[1], lang)}, срок ${estimateTimeline}${includeVat ? ", с VAT 5%" : ", без VAT"}.`
      : `Hello! I would like to refine this preliminary estimate: ${t.calcTabs[calculatorType]}, ${configuration}, AED ${formatAed(estimate[0], lang)}–${formatAed(estimate[1], lang)}, timeline ${estimateTimeline}${includeVat ? ", including 5% VAT" : ", excluding VAT"}.`;
    setEstimateMessage(message);
    window.location.assign(whatsapp(message));
  }

  return (
    <section id="calculator" className="section calculator-section">
      <div className="calculator-copy" data-reveal><p className="eyebrow">{t.calculatorKicker}</p><Heading>{t.calculatorTitle}</Heading><p>{t.calculatorText}</p></div>
      <div className="calculator-card" data-reveal>
        <div className="calculator-tabs">{(["renovation", "furniture"] as CalculatorType[]).map((type) => <button type="button" key={type} aria-pressed={calculatorType === type} className={calculatorType === type ? "active" : ""} onClick={() => setCalculatorType(type)}>{t.calcTabs[type]}</button>)}</div>
        <div className="calculator-controls">
          {calculatorType === "renovation" && <>
            <label><span>{t.area}<b>{area} m²</b></span><input type="range" min="30" max="600" step="10" value={area} onChange={(event) => setArea(Number(event.target.value))} /></label>
            <fieldset><legend>{t.propertyType}</legend><div>{(["apartment", "villa", "commercial"] as PropertyType[]).map((type) => <button key={type} aria-pressed={propertyType === type} className={propertyType === type ? "active" : ""} type="button" onClick={() => setPropertyType(type)}>{t.propertyTypes[type]}</button>)}</div></fieldset>
            <fieldset><legend>{t.level}</legend><div>{(["cosmetic", "standard", "premium"] as const).map((level) => <button key={level} aria-pressed={renovationLevel === level} className={renovationLevel === level ? "active" : ""} type="button" onClick={() => setRenovationLevel(level)}>{t.levels[level]}</button>)}</div></fieldset>
          </>}
          {calculatorType === "furniture" && <>
            <label><span>{t.meters}<b>{furnitureMeters} m</b></span><input type="range" min="2" max="60" step="1" value={furnitureMeters} onChange={(event) => setFurnitureMeters(Number(event.target.value))} /></label>
            <fieldset><legend>{t.furnitureLevel}</legend><div className="two-options">{(["standard", "premium"] as FurnitureLevel[]).map((level) => <button key={level} aria-pressed={furnitureLevel === level} className={furnitureLevel === level ? "active" : ""} type="button" onClick={() => setFurnitureLevel(level)}>{t.furnitureLevels[level]}</button>)}</div></fieldset>
          </>}
          <label className="vat-toggle"><input type="checkbox" checked={includeVat} onChange={(event) => setIncludeVat(event.target.checked)} /><span>{t.includeVat}</span></label>
        </div>
        <div className="estimate-box"><span>{t.estimate}</span><strong>AED {formatAed(estimate[0], lang)} — {formatAed(estimate[1], lang)}</strong><div className="estimate-timeline"><span>{t.timeline}</span><b>{estimateTimeline}</b></div><p><strong>{includeVat ? (lang === "ru" ? "Включая VAT 5%. " : "Including 5% VAT. ") : (lang === "ru" ? "Без VAT. " : "Excluding VAT. ")}</strong>{lang === "ru" ? "Ориентир включает выбранные работы и материалы. Согласования, техника, доставка из Китая и индивидуальные позиции — отдельно. Точный состав фиксируется в смете." : "The range covers the selected works and materials. Approvals, appliances, China shipping and bespoke extras are separate. The exact scope is confirmed in the quotation."}</p><button className="button button-primary" type="button" onClick={contactEstimate}>{t.calcCta}<ResponsiveArrow /></button>
          {estimateMessage && <p className="calculator-contact-fallback" role="status">{lang === "ru" ? "Если WhatsApp не открылся: " : "If WhatsApp did not open: "}<a href={whatsapp(estimateMessage)}>{lang === "ru" ? "открыть сообщение" : "open your message"}</a> · <a href={`mailto:info@space-buro.ae?subject=Space%20Buro%20enquiry&body=${encodeURIComponent(estimateMessage)}`}>Email</a></p>}
        </div>
      </div>
    </section>
  );
}
