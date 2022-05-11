/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
    readonly PUBLIC_URL: string;
  }
}

declare module "*.bmp" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  import * as React from "react";

  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

  const src: string;
  export default src;
}

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.module.scss" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.module.sass" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "react-payment-inputs";

declare module "react-payment-inputs/images" {
  interface ImagesProps {
    amex: object;
    dinersclub: object;
    discover: object;
    hipercard: object;
    jcb: object;
    mastercard: object;
    placeholder: object;
    unionpay: object;
    visa: object;
  }

  const images: ImagesProps;

  export default images;
}

declare module "react-currency-format" {
  import { ComponentClass } from "react";

  interface CurrencyInputProps {
    value: string | number;
    displayType: string;
    fixedDecimalScale: boolean;
    decimalScale: number;
    prefix: string;
  }

  const CurrencyFormat: ComponentClass<CurrencyInputProps>;

  export default CurrencyFormat;
}
