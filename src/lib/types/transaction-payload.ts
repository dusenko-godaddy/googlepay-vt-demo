/**
 * The data that is sent to the create transaction endpoint.
 */
export interface TransactionPayload {
  number: string;
  exp: {
    month: string;
    year: string;
  };
  cvc: string;
  amount: number;
  firstName: string;
  lastName: string;
  zip: string;
  emailAddress?: string;
  emailReceipt?: boolean;
  authOnly?: boolean;
  applicationId?: string;
  type?: string;
  disablePartialApproval?: boolean;
  siftSessionId?: string;
  referenceId?: string;
}
