/**
 * The data that is sent to the create token endpoint.
 */
export interface TokenizePayload {
  number: string;
  exp: {
    month: string;
    year: string;
  };
  firstName?: string;
  lastName?: string;
  zip?: string;
  emailAddress?: string;
  applicationId?: string;
  type?: string;
  siftSessionId?: string;
  isTokenTransactionNext?: boolean;
}
