import ChinaFurnitureDetail from "../../china-furniture/ChinaFurnitureDetail";
import StructuredData from "../../StructuredData";
import { chinaMetadata, siteUrl, pathFor } from "../../site";
export const metadata = chinaMetadata("ru");
export default function Page() { return <><StructuredData data={{"@context":"https://schema.org","@type":"Service",name: "Мебель из Китая",url:siteUrl+pathFor("ru", "/china-furniture"),provider:{"@id":siteUrl+"/#business"},areaServed:"United Arab Emirates"}} /><ChinaFurnitureDetail lang="ru" /></>; }
