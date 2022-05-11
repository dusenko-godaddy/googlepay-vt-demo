/**
 * The data that is sent to the validate applepay merchant
 */
export interface ValidateGooglePayPayload {
  domain: string;
}

export interface ValidateGooglePayResponse {
  authJwt: string;
  googleEnvironment: "TEST" | "PRODUCTION";
}
