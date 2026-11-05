import type { Lang } from "./data";

export type CalculatorType = "renovation" | "furniture";
export type PropertyType = "apartment" | "villa" | "commercial";
export type FurnitureLevel = "standard" | "premium";
export type RenovationLevel = "cosmetic" | "standard" | "premium";

type EstimateInput = {
  calculatorType: CalculatorType;
  area: number;
  propertyType: PropertyType;
  renovationLevel: RenovationLevel;
  furnitureMeters: number;
  furnitureLevel: FurnitureLevel;
  includeVat: boolean;
};

export function calculateEstimate({ calculatorType, area, propertyType, renovationLevel, furnitureMeters, furnitureLevel, includeVat }: EstimateInput) {
  const vatFactor = includeVat ? 1.05 : 1;
  if (calculatorType === "furniture") {
    const materialFactor = furnitureLevel === "premium" ? 1.35 : 1;
    return {
      range: [furnitureMeters * 1800 * materialFactor * vatFactor, furnitureMeters * 3300 * materialFactor * vatFactor],
      weeks: furnitureLevel === "premium" ? [8, 13] : [5, 9],
    };
  }
  const rates = { cosmetic: [350, 550], standard: [1105, 1625], premium: [1950, 2990] } as const;
  const propertyFactor = { apartment: 1, villa: 1.12, commercial: 1.08 }[propertyType];
  const base = { cosmetic: [4, 8], standard: [8, 14], premium: [12, 20] }[renovationLevel];
  const areaAdjustment = Math.max(0, Math.ceil((area - 150) / 120));
  return {
    range: [area * rates[renovationLevel][0] * propertyFactor * vatFactor, area * rates[renovationLevel][1] * propertyFactor * vatFactor],
    weeks: [base[0] + areaAdjustment, base[1] + areaAdjustment],
  };
}

export function formatAed(value: number, lang: Lang) {
  return new Intl.NumberFormat(lang === "ru" ? "ru-RU" : "en-AE", { maximumFractionDigits: 0 }).format(Math.round(value / 1000) * 1000);
}
