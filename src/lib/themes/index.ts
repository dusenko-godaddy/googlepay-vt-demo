import defaultExample from "./default.json";
import example1 from "./example1.json";
import example2 from "./example2.json";
import customer from "./customer.json";
import ecommerce from "./ecommerce.json";

const themes: { [key: string]: Record<string, Record<string, string>> } = {
  default: defaultExample,
  example1: example1,
  example2: example2,
  customer: customer,
  ecommerce: ecommerce,
};

export default themes;
