import { CurrencyCode } from "../lib/enums/currency-code";

const currencySymbol: Record<CurrencyCode, string> = {
  USD: "$",
  CAD: "C$",
};

export default {...currencySymbol};
