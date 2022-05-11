import { ApplePayPaymentToken } from "../../lib/types/applepay-payment-token";
import { GooglePayPaymentToken } from "../../lib/types/googlepay-payment-token";

/**
 * The data that is sent to the get nonce endpoint
 */
export interface NoncePayload {
  card?: {
    number: string;
    expirationYear: string;
    expirationMonth: string;
    type: string;
    cardHolderFirstName?: string;
    cardHolderLastName?: string;
  };
  verificationData?: {
    cvData: string;
    cardHolderBillingAddress: {
      postalCode: string;
      line1?: string;
    };
  };
  applicationId: string;
  applePayPaymentToken?: ApplePayPaymentToken;
  googlePayPaymentToken?: GooglePayPaymentToken;
}
