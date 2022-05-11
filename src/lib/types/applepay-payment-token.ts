export interface ApplePayPaymentToken {
  paymentData: ApplePayPaymentData;
  paymentMethod: ApplePayPaymentMethod;
  transactionIdentifier: string;
}

interface ApplePayPaymentMethod {
  displayName?: string;
  network?: string;
  type?: string;
}

interface ApplePayPaymentData {
  header: ApplePayPaymentHeader;
  data: string;
  signature: string;
}

interface ApplePayPaymentHeader {
  publicKeyHash?: string;
  ephemeralPublicKey: string;
  transactionId?: string;
}
