import type { Metadata } from "next";
import ChinaFurnitureDetail from "./ChinaFurnitureDetail";

export const metadata: Metadata = {
  title: "Мебель из Китая в Дубай | Space Buro",
  description: "Подбор фабрик в Фошане, образцы, контроль производства, консолидация, доставка и координация установки мебели в ОАЭ.",
};

export default function ChinaFurniturePage() {
  return <ChinaFurnitureDetail />;
}
