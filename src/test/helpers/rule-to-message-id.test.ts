import { getRuleMessageId } from "../../lib/helpers/rule-to-message-id";

describe("Localization Helper Test Suite", () => {
  it("getRuleMessageId returns rule message id if rule exists", () => {
    expect(getRuleMessageId("number")).toBe("error.validation.rule.number");
  });

  it("getRuleMessageId returns default message id if rule not exists", () => {
    expect(getRuleMessageId("test")).toBe("error.validation.rule.unknown");
  });
});
