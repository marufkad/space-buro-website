import Home from "../Home";
import StructuredData from "../StructuredData";
import { homeMetadata, businessSchema } from "../site";
export const metadata = homeMetadata("en");
export default function Page() { return <><StructuredData data={businessSchema} /><Home lang="en" /></>; }
