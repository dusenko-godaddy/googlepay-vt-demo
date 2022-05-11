import { EventType } from "../enums";
import { CurrencyCode } from "../enums/currency-code";

import currencySymbol from "../../localization/currency-symbol";

export enum TransactionStatus {
  Authorized = "AUTHORIZED",
  Captured = "CAPTURED",
  Declined = "DECLINED",
  Voided = "VOIDED",
  Refunded = "REFUNDED",
  CreateEcommerceTransaction = "CreateEcommerceTransaction",
  GetNonce = "GetNonce",  // Deprecated
}

/**
 * Takes in a Poynt transaction status and returns the corresponding event type.
 */
export function transactionStatusToEventType(status: string): EventType {
  switch (status) {
    case TransactionStatus.Authorized:
      return EventType.TransactionCreated;
    case TransactionStatus.Captured:
      return EventType.TransactionCreated;
    case TransactionStatus.Declined:
      return EventType.TransactionDeclined;
    case TransactionStatus.Voided:
    case TransactionStatus.Refunded:
      return EventType.TransactionVoided;
    case TransactionStatus.CreateEcommerceTransaction:
      return EventType.CreateEcommerceTransaction;
    case TransactionStatus.GetNonce:  // Deprecated
      return EventType.GetNonce;
    default:
      return EventType.Error;
  }
}

export function getCurrencySymbol(currency: CurrencyCode) {
  if (currencySymbol[currency]) {
    return currencySymbol[currency];
  }

  return "$";
}
