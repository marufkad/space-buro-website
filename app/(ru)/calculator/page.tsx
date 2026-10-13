import CalculatorPage from "../../CalculatorPage";
import { calculatorMetadata } from "../../site";

export const metadata = calculatorMetadata("ru");
export default function Page() { return <CalculatorPage lang="ru" />; }
