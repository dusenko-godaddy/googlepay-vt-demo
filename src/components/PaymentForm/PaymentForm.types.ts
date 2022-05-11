import { CurrencyCode } from "../../lib/enums/currency-code";

import { ApplePayPaymentToken } from "../../lib/types/applepay-payment-token";
import { GooglePayPaymentToken } from "../../lib/types/googlepay-payment-token";

export interface CreateTransactionOptions {
  amount?: number;
  emailAddress?: string;
  firstName?: string;
  lastName?: string;
  zip?: string;
  authOnly?: boolean;
  disablePartialApproval?: boolean;
  referenceId?: string;
}

export interface CreateTokenOptions {
  firstName?: string;
  lastName?: string;
  zip?: string;
  isTokenTransactionNext?: boolean;
}

export interface CreateTokenTransactionOptions {
  amount: number;
  token: string;
  customerUserId?: number;
  authOnly?: boolean;
  emailAddress?: string;
}

export interface GetNonceOptions {
  firstName?: string;
  lastName?: string;
  zip?: string;
  line1?: string;
  ssid?: string;
  applePayPaymentToken?: ApplePayPaymentToken;
  googlePayPaymentToken?: GooglePayPaymentToken;
}

export interface ValidateApplePayOptions {
  domainName: string;
  validationUrl?: string;
  displayName?: string;
}

export interface ValidateGooglePayOptions {
  domainName: string;
}

export interface DisplayComponentsInterface {
  emailAddress?: boolean;
  firstName?: boolean;
  lastName?: boolean;
  zipCode?: boolean;
  address?: boolean;
  state?: boolean;
  country?: boolean;
  phone?: boolean;
  ecommerceFirstName?: boolean;
  ecommerceLastName?: boolean;
  ecommerceEmailAddress?: boolean;
  ecommerceNotes?: boolean;
  submitButton?: boolean;
  submitTokenButton?: boolean;
  showEndingPage?: boolean;
  showLabels?: boolean;
  labels?: boolean;
  ecommerceLabels?: boolean;
  paymentLabel?: boolean;
}

export interface IFrameInterface {
  border?: string;
  borderRadius?: string;
  boxShadow?: string;
  height?: string;
  width?: string;
}

type PaymentMethod = "card" | "apple_pay" | "google_pay";

export interface Params {
  amount: number;
  apiKey: string; // Collect V1
  businessId: string; // Collect V2
  authOnly?: boolean;
  emailReceipt?: boolean;
  applicationId: string;
  breakcache?: string;
  displayComponents: DisplayComponentsInterface;
  iFrame?: IFrameInterface;
  parentUrl?: string;
  style?: object;
  fields?: {
    emailAddress?: string;
    firstName?: string;
    lastName?: string;
  };
  additionalFieldsToValidate?: string[];
  paymentMethods?: PaymentMethod[];
}

interface ErrorMessages {
  emptyCardNumber?: string;
  emptyExpiryDate?: string;
  emptyCVC?: string;
  invalidCardNumber?: string;
  invalidExpiryDate?: string;
  invalidCVC?: string;
  monthOutOfRange?: string;
  yearOutOfRange?: string;
  dateOutOfRange?: string;
}

export interface Props {
  port: MessagePort | null;
  params: Params;
  locale: string;
  currency: CurrencyCode;
  siftSessionId: string;
  errorMessages?: ErrorMessages;
}
