import { getIntl } from "../../lib/helpers/localization";
import { getRuleMessageId } from "../../lib/helpers/rule-to-message-id";
import { validateInputs, validateForm, validator } from "../../lib/helpers/validator";

const intl = getIntl();

describe("Validator Helper Test Suite", () => {
  describe.each([
    [null, [], true],
    [null, ["zipCode", "emailAddress", "firstName", "lastName"], true],
    ["zip", [], true],
    ["emailAddress", [], true],
    ["firstName", [], true],
    ["lastName", [], true],
    [null, ["zipCode"], true],
    [null, ["emailAddress"], true],
    [null, ["firstName"], true],
    [null, ["lastName"], true],
    ["cardNumber", [], false],
    ["exp", [], false],
    ["exp.month", [], false],
    ["exp.year", [], false],
    ["cvc", [], false],
    ["zip", ["zipCode"], false],
    ["emailAddress", ["emailAddress"], false],
    ["firstName", ["firstName"], false],
    ["lastName", ["lastName"], false],
  ])("validateInputs", (missingField, displayComponents, expected) => {
    const data = {
      cardNumber: missingField === "cardNumber" ? "" : "4242 4242 4242 4242",
      exp: missingField === "exp" ? null : {
        month: missingField === "exp.month" ? "" : "12",
        year: missingField === "exp.year" ? "" : "25"
      },
      cvc: missingField === "cvc" ? "" : "123",
      validZip: missingField === "zip" ? false : true,
      validEmail: missingField === "emailAddress" ? false : true,
      firstName: missingField === "firstName" ? "" : "Test",
      lastName: missingField === "lastName" ? "" : "Test",
    };

    const params = {
      displayComponents: {} as Record<string, boolean>
    };
  
    (displayComponents || []).forEach(item => params.displayComponents[item] = true);

    const missingFieldText = `missingField: ${missingField || "no missing field"}`;
    const displayComponentsText = `displayComponents: ${displayComponents.length ? displayComponents.join(", ") : "no display components"}`;

    it(`returns ${expected} (${missingFieldText}, ${displayComponentsText})`, () => {
      const result = validateInputs(data, params);
      expect(result).toBe(expected);
    });
  });

  describe.each([
    [null, null, [], "", true],
    [null, null, ["number", "exp", "cvc", "zip", "emailAddress", "firstName", "lastName", "amount", "applicationId"], "", true],
    ["number", null, [], "", true],
    ["exp", null, [], "", true],
    ["cvc", null, [], "", true],
    ["zip", null, [], "", true],
    [null, "zip", [], "", true],
    ["emailAddress", null, [], "", true],
    [null, "emailAddress", [], "", true],
    ["firstName", null, [], "", true],
    ["lastName", null, [], "", true],
    ["amount", null, [], "", true],
    ["applicationId", null, [], "", true],
    [null, null, [], "error", false],
    ["number", null, ["number"], "", false],
    ["exp", null, ["exp"], "", false],
    ["cvc", null, ["cvc"], "", false],
    ["zip", null, ["zip"], "", false],
    [null, "zip", ["zip"], "", false],
    ["emailAddress", null, ["emailAddress"], "", false],
    [null, "emailAddress", ["emailAddress"], "", false],
    ["firstName", null, ["firstName"], "", false],
    ["lastName", null, ["lastName"], "", false],
    ["amount", null, ["amount"], "", false],
    ["applicationId", null, ["applicationId"], "", false],
  ])("validateForm", (missingField, invalidField, rules, currentValidationError, expected) => {
    const data = {
      number: missingField === "number" ? "" : "4242 4242 4242 4242",
      exp: missingField === "exp" ? null : {
        month: missingField === "exp.month" ? "" : "12",
        year: missingField === "exp.year" ? "" : "25"
      },
      cvc: missingField === "cvc" ? "" : "123",
      zip: missingField === "zip" ? "" : invalidField === "zip" ? "test" : "12345",
      emailAddress: missingField === "emailAddress" ? "" : invalidField === "emailAddress" ? "test" : "test@test.test",
      firstName: missingField === "firstName" ? "" : "Test",
      lastName: missingField === "lastName" ? "" : "Test",
      amount: missingField === "amount" ? "" : "2000",
      applicationId: missingField === "applicationId" ? "" : "testid",
    };

    const missingFieldText = `missingField: ${missingField || "no missing field"}`;
    const invalidFieldText = `invalidField: ${invalidField || "no invalid field"}`;
    const currentValidationErrorText = `currentValidationError: ${currentValidationError || "no current validation error field"}`;
    const rulesText = `rules: ${rules?.length ? rules.join(", ") : "no rules"}`

    it(`returns ${expected} (${missingFieldText}, ${invalidFieldText}, ${rulesText}, ${currentValidationErrorText})`, () => {
      const result = validateForm(data, rules, currentValidationError, "en-US", null);
      expect(result).toBe(expected);
    });
  });

  describe.each([
    [null, [], ""],
    [null, ["number", "exp", "cvc", "zip", "emailAddress", "firstName", "lastName", "amount", "applicationId"], ""],
    ["number", [], ""],
    ["exp", [], ""],
    ["cvc", [], ""],
    ["zip", [], ""],
    ["emailAddress", [], ""],
    ["firstName", [], ""],
    ["lastName", [], ""],
    ["amount", [], ""],
    ["applicationId", [], ""],
    ["number", ["number"], intl.formatMessage({ id: getRuleMessageId("number") })],
    ["exp", ["exp"], intl.formatMessage({ id: getRuleMessageId("exp") })],
    ["cvc", ["cvc"], intl.formatMessage({ id: getRuleMessageId("cvc") })],
    ["zip", ["zip"], intl.formatMessage({ id: getRuleMessageId("zip") })],
    ["emailAddress", ["emailAddress"], intl.formatMessage({ id: getRuleMessageId("emailAddress") })],
    ["firstName", ["firstName"], intl.formatMessage({ id: getRuleMessageId("firstName") })],
    ["lastName", ["lastName"], intl.formatMessage({ id: getRuleMessageId("lastName") })],
    ["amount", ["amount"], intl.formatMessage({ id: getRuleMessageId("amount") })],
    ["applicationId", ["applicationId"], intl.formatMessage({ id: getRuleMessageId("applicationId") })],
  ])("validator", (missingField, rules, expected) => {
    const data = {
      number: missingField === "number" ? "" : "4242 4242 4242 4242",
      exp: missingField === "exp" ? null : {
        month: missingField === "exp.month" ? "" : "12",
        year: missingField === "exp.year" ? "" : "25"
      },
      cvc: missingField === "cvc" ? "" : "123",
      zip: missingField === "zip" ? "" : "12345",
      emailAddress: missingField === "emailAddress" ? "" : "test@test.test",
      firstName: missingField === "firstName" ? "" : "Test",
      lastName: missingField === "lastName" ? "" : "Test",
      amount: missingField === "amount" ? "" : "2000",
      applicationId: missingField === "applicationId" ? "" : "testid",
    };

    const missingFieldText = `missingField: ${missingField || "no missing field"}`;
    const rulesText = `rules: ${rules?.length ? rules.join(", ") : "no rules"}`

    it(`returns ${expected || "empty string"} (${missingFieldText}, ${rulesText})`, () => {
      const result = validator(data, rules, intl);
      expect(result).toBe(expected);
    });
  });
});
