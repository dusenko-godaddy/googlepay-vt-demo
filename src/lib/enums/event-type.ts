export enum EventType {
  // inbound
  Init = "init",
  UpdateMessagePort = "update_message_port",
  OpCreateTransaction = "op_create_transaction",
  OpCreateToken = "op_create_token",
  OpCreateTokenTransaction = "op_create_token_transaction",
  OpGetNonce = "op_get_nonce",
  OpValidateApplePay = "op_validate_applepay",
  // outbound
  ValidateApplePay = "validate_applepay",
  TransactionCreated = "transaction_created",
  TransactionDeclined = "transaction_declined",
  TransactionVoided = "transaction_voided",
  Error = "error",
  Ready = "ready",
  Nonce = "nonce",
  Token = "token",
  Validated = "validated",
  CreateEcommerceTransaction = "create_ecommerce_transaction",
  GetNonce = "get_nonce", // Deprecated
  SiftSession = "set_sift_session",
  IFrameContentReady = "iframe_ready",
}
