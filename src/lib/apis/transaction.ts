import axios from "axios";
import { v4 as uuid } from "uuid";
import { NoncePayload } from "../types/nonce-payload";
import { TransactionPayload } from "../types/transaction-payload";
import { TokenizePayload } from "../types/tokenize-payload";
import { TokenTransactionPayload } from "../types/token-transaction-payload";
import { ValidateApplePayPayload } from "../types/validate-applepay-payload";
import { ValidateGooglePayPayload, ValidateGooglePayResponse } from "../types/validate-googlepay-payload";
import { getApiserviceUrl } from "../helpers/api-service-url";

const apiserviceUrl = "https://1438-2600-1700-5450-9570-bd4b-8d86-f961-8790.ngrok.io";

/**
 * Send backend request to initiate an auth or sale transaction using card data.
 * @param apiKey
 * @param txnPayload
 */
export async function authorizeTransaction(
  apiKey: string,
  txnPayload: TransactionPayload
): Promise<any> {
  return new Promise((resolve, reject) => {
    axios
      .post("/poynt-collect/transaction", txnPayload, {
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
      })
      .then((response) => {
        resolve(response && response.data);
      })
      .catch((err) => {
        reject((err && err.response) || err);
      });
  });
}

/**
 * Send backend request to initiate an auth only transaction using card data.
 * @param apiKey
 * @param txnPayload
 */
export async function authOnlyTransaction(
  apiKey: string,
  txnPayload: TransactionPayload
): Promise<any> {
  txnPayload.authOnly = true;
  authorizeTransaction(apiKey, txnPayload);
}

/**
 * Send backend request to initiate an auth or sale transaction using card token.
 * @param apiKey
 * @param tokenTransactionPayload
 */
export async function chargeToken(
  apiKey: string,
  tokenTransactionPayload: TokenTransactionPayload
): Promise<any> {
  const response = await axios.post("/poynt-collect/charge-token", tokenTransactionPayload, {
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
  });
  return response.data;
}

// maps library types to poynt types
const libraryCardTypeMap: { [key: string]: string } = {
  AMEX: "AMERICAN_EXPRESS",
  amex: "AMERICAN_EXPRESS",
  dinersclub: "DINERS_CLUB",
  DINERSCLUB: "DINERS_CLUB",
};

/**
 * Send backend request to generate a Collect V1 card token.
 * @param apiKey
 * @param tokenPayload
 */
export async function tokenize(apiKey: string, tokenPayload: TokenizePayload): Promise<any> {
  if (tokenPayload.type && tokenPayload.type in libraryCardTypeMap) {
    tokenPayload.type = libraryCardTypeMap[tokenPayload.type];
  }

  const response = await axios.post("/poynt-collect/tokenize", tokenPayload, {
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
  });
  return response.data;
}

/**
 * Send backend request to get Nonce used to generate Collect V2 card tokenization.
 * @param businessId
 * @param noncePayload
 */
export async function getNonceRequest(
  businessId: string,
  noncePayload: NoncePayload,
  ssid: string | undefined
): Promise<any> {
  if (noncePayload.card && noncePayload.card.type && noncePayload.card.type in libraryCardTypeMap) {
    noncePayload.card.type = libraryCardTypeMap[noncePayload.card.type];
  }

  const headers = {
    "Poynt-Request-Id": uuid(),
    "Poynt-Session-Id": ssid ? ssid : uuid(),
  };

  const response = await axios.post(
    `${apiserviceUrl}/businesses/${encodeURIComponent(businessId)}/cards/open-tokenize`,
    noncePayload,
    { headers }
  );

  return response.data;
}

export async function ecommerceTransaction(ecommerceTransaction: any): Promise<any> {
  if (
    ecommerceTransaction &&
    ecommerceTransaction.fundingSource &&
    ecommerceTransaction.fundingSource.card &&
    ecommerceTransaction.fundingSource.card.type in libraryCardTypeMap
  ) {
    ecommerceTransaction.fundingSource.card.type =
      libraryCardTypeMap[ecommerceTransaction.fundingSource.card.type];
  }

  return new Promise((resolve, reject) => {
    axios
      .post("/ecommerce/transaction", ecommerceTransaction, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Poynt-Request-Id": ecommerceTransaction.poyntRequestId,
          "User-Agent": "Poynt-Collectv2-" + ecommerceTransaction.applicationId,
        },
      })
      .then((response) => {
        resolve(response && response.data);
      })
      .catch((err) => {
        reject((err && err.response) || err);
      });
  });
}

export async function validateApplePayRequest(
  businessId: string,
  validateApplepayPayload: ValidateApplePayPayload
): Promise<any> {
  const headers = {
    "Content-Type": "application/json",
  };

  const response = await axios.post(
    `${apiserviceUrl}/businesses/${encodeURIComponent(businessId)}/apple-pay/validate`,
    validateApplepayPayload,
    { headers }
  );

  return response.data;
}

export async function validateGooglePayRequest(
  businessId: string,
  validateGooglePayPayload: ValidateGooglePayPayload,
): Promise<ValidateGooglePayResponse> {
  const headers = {
    "Content-Type": "application/json",
  };

  const response = await axios.post(
    `${apiserviceUrl}/businesses/${encodeURIComponent(businessId)}/google-pay/validate`,
    validateGooglePayPayload,
    { headers }
  );

  return response.data;
}
