import ChinaFurnitureDetail from "../../china-furniture/ChinaFurnitureDetail";
import StructuredData from "../../StructuredData";
import { chinaMetadata, siteUrl, pathFor } from "../../site";
export const metadata = chinaMetadata("en");
export default function Page() { return <><StructuredData data={{"@context":"https://schema.org","@type":"Service",name: "Furniture from China",url:siteUrl+pathFor("en", "/china-furniture"),provider:{"@id":siteUrl+"/#business"},areaServed:"United Arab Emirates"}} /><ChinaFurnitureDetail lang="en" /></>; }
