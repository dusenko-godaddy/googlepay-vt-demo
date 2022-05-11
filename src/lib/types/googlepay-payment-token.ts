export interface GooglePayPaymentToken {
  type: PaymentMethodType;
  info?: CardInfo | undefined;
  description?: string | undefined;
  tokenizationData: PaymentMethodTokenizationData;
}

interface CardInfo {
  assuranceDetails?: AssuranceDetails | undefined;
  cardNetwork: CardNetwork;
  cardDetails: string;
  billingAddress?: Address | undefined;
}

interface AssuranceDetails {
  accountVerified?: boolean | undefined;
  cardHolderAuthenticated?: boolean | undefined;
}

interface Address {
  name?: string | undefined;
  address1?: string | undefined;
  address2?: string | undefined;
  address3?: string | undefined;
  locality: string;
  administrativeArea: string;
  countryCode: string;
  postalCode: string;
  sortingCode?: string | undefined;
  phoneNumber?: string | undefined;
}

interface PaymentMethodTokenizationData {
  type: PaymentMethodTokenizationType;
  token: string;
}

type PaymentMethodType = "CARD" | "PAYPAL";
type PaymentMethodTokenizationType = "PAYMENT_GATEWAY" | "DIRECT";
type CardNetwork = "AMEX" | "DISCOVER" | "ELECTRON" | "ELO" | "ELO_DEBIT" | "INTERAC" | "JCB" | "MAESTRO" | "MASTERCARD" | "VISA";
