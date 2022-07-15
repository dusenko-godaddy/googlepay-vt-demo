export enum EventType {
  // Inbound from Poynt Collect
  Init = "init",
  OpCreateTransaction = "op_create_transaction",
  OpCreateToken = "op_create_token",
  OpCreateTokenTransaction = "op_create_token_transaction",
  OpCreateNonceTransaction = "op_create_nonce_transaction",
  OpGetNonce = "op_get_nonce",
  OpGetWalletNonce = "op_get_wallet_nonce",
  OpValidateApplePay = "op_validate_applepay",
  OpValidateGooglePay = "op_validate_googlepay",
  SiftSession = "set_sift_session",
  CreateEcommerceTransaction = "create_ecommerce_transaction",

  // Outbound to Poynt Collect
  ValidateApplePay = "validate_applepay",
  ValidateGooglePay = "validate_googlepay",
  TransactionCreated = "transaction_created",
  TransactionDeclined = "transaction_declined",
  TransactionVoided = "transaction_voided",
  Error = "error",
  WalletNonceError = "wallet_nonce_error",
  ValidateGooglePayError = "validate_googlepay_error",
  Ready = "ready",
  Nonce = "nonce",
  WalletNonce = "wallet_nonce",
  Token = "token",
  Validated = "validated",
  GetNonce = "get_nonce", // Deprecated
  IFrameContentReady = "iframe_ready",
}
