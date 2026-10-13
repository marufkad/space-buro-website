import CalculatorPage from "../../CalculatorPage";
import { calculatorMetadata } from "../../site";

export const metadata = calculatorMetadata("en");
export default function Page() { return <CalculatorPage lang="en" />; }
