const ruleToMessageIdMap = new Map<string, string>([
  ["number", "error.validation.rule.number"],
  ["exp", "error.validation.rule.exp"],
  ["cvc", "error.validation.rule.cvc"],
  ["zip", "error.validation.rule.zip"],
  ["firstName", "error.validation.rule.firstName"],
  ["lastName", "error.validation.rule.lastName"],
  ["emailAddress", "error.validation.rule.emailAddress"],
  ["address", "error.validation.rule.address"],
  ["state", "error.validation.rule.state"],
  ["country", "error.validation.rule.country"],
  ["phone", "error.validation.rule.phone"],
  ["amount", "error.validation.rule.amount"],
  ["applicationId", "error.validation.rule.applicationId"]
]);

export const getRuleMessageId = (rule: string): string => {
  return ruleToMessageIdMap.get(rule) || "error.validation.rule.unknown";
}
