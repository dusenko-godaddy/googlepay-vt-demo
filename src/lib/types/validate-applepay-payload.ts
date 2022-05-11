/**
 * The data that is sent to the validate applepay merchant
 */
export interface ValidateApplePayPayload {
  domainName: string;
  displayName?: string;
  validationUrl?: string;
}
