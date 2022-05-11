/**
 * The data that is sent to the charge token endpoint.
 */
export interface TokenTransactionPayload {
  amount: number;
  token: string;
  customerUserId?: number;
  authOnly?: boolean;
  emailAddress?: string;
  emailReceipt?: boolean;
}
