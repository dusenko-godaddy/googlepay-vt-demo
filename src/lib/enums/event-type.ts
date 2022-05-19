export enum EventType {
  // Inbound from Poynt Collect
  Init = "init",
  OpCreateTransaction = "op_create_transaction",
  OpCreateToken = "op_create_token",
  OpCreateTokenTransaction = "op_create_token_transaction",
  OpGetNonce = "op_get_nonce",
  OpGetWalletNonce = "op_get_wallet_nonce",
  OpValidateApplePay = "op_validate_applepay",
  SiftSession = "set_sift_session",
  CreateEcommerceTransaction = "create_ecommerce_transaction",

  // Outbound to Poynt Collect
  ValidateApplePay = "validate_applepay",
  TransactionCreated = "transaction_created",
  TransactionDeclined = "transaction_declined",
  TransactionVoided = "transaction_voided",
  Error = "error",
  WalletNonceError = "wallet_nonce_error",
  Ready = "ready",
  Nonce = "nonce",
  WalletNonce = "wallet_nonce",
  Token = "token",
  Validated = "validated",
  GetNonce = "get_nonce", // Deprecated
  IFrameContentReady = "iframe_ready",
}
