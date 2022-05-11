import { EventType } from "../../lib/enums";
import { CurrencyCode } from "../../lib/enums/currency-code";

import { 
  TransactionStatus,
  getCurrencySymbol,
  transactionStatusToEventType
} from "../../lib/helpers/transaction";

describe("Transaction Helper Test Suite", () => {
  it.each([
    [EventType.TransactionCreated, TransactionStatus.Authorized],
    [EventType.TransactionCreated, TransactionStatus.Captured],
    [EventType.TransactionDeclined, TransactionStatus.Declined],
    [EventType.TransactionVoided, TransactionStatus.Voided],
    [EventType.TransactionVoided, TransactionStatus.Refunded],
    [EventType.CreateEcommerceTransaction, TransactionStatus.CreateEcommerceTransaction],
    [EventType.GetNonce, TransactionStatus.GetNonce],
    [EventType.Error, "unknown"],
  ])("transactionStatusToEventType returns %p event type if %p transaction status is passed in", (expected, transactionStatus) => {
    const result = transactionStatusToEventType(transactionStatus);
    expect(result).toBe(expected);
  });

  it.each([
    ["$", CurrencyCode.USD],
    ["C$", CurrencyCode.CAD],
  ])("getCurrencySymbol returns %p currency symbol if %p currency is passed in", (expected, currency) => {
    const result = getCurrencySymbol(currency);
    expect(result).toBe(expected);
  });
});
