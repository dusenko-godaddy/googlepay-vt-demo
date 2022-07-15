/**
 * The data that is sent to the validate googlepay merchant
 */
export interface ValidateGooglePayPayload {
  domain: string;
}

/**
 * The response data from the validate googlepay merchant
 */
export interface ValidateGooglePayResponse {
  authJwt: string;
  googleEnvironment: "TEST" | "PRODUCTION";
}
