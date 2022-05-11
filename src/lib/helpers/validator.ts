import { IntlShape } from "react-intl";

import { getIntl } from "./localization";
import { getRuleMessageId } from "./rule-to-message-id";
import { postParentMessage } from "./post-parent-message";

import { Errors } from "../../lib/enums/errors";
import { EventType } from "../../lib/enums/event-type";

import areaCodeValidation from "../../localization/area-code-validation";

export function emailIsValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function zipIsValid(zip: string, locale: string) {
  return areaCodeValidation[locale]?.test(zip) ?? true;
}

/**
 * Does a series of checks against an array of validation
 * fields passed in against an object and returns a rule it fails on
 * value - object
 * rules - array of keys to check
 */
export function validator(value: any, rules: Array<string>, intl: IntlShape) {
  let curr = "";

  rules.forEach((rule) => {
    let val = value[rule];

    if (
      typeof val === "undefined" ||
      val === null ||
      val === "" ||
      (typeof val === "string" && val.trim() === "") ||
      (typeof val === "object" && Object.entries(val).filter(([k, v], i) => !!v).length === 0)
    ) {
      curr += ", " + intl.formatMessage({ id: getRuleMessageId(rule) });
    }
  });

  if (curr) {
    curr = curr.substring(2);
  }

  return curr;
}

// does a series of checks to validate form
export function validateForm(
  data: any, 
  rules: any, 
  currentValidationError: string, 
  locale: string, 
  port: MessagePort | null
) {
  const intl = getIntl(locale);

  const dataCopy = Object.assign({}, data);
  // redact card info
  if (dataCopy && dataCopy.number) {
    dataCopy.number = "****"; // hide card number in logs
  }
  // three checks
  // 1. is to check whether or not if there is an error with card details i.e invalid card
  if (currentValidationError) {
    postParentMessage(EventType.Error, {
      error: {
        message: currentValidationError,
        type: Errors.InvalidDetails,
        data: dataCopy,
        field: "",
        meta: {},
        source: "submit",
      },
    }, port);

    return false;
  }

  let validation = validator(data, rules, intl);

  // 2. check if any empty fields
  if (validation) {
    postParentMessage(EventType.Error, {
      error: {
        message: intl.formatMessage(
          { id: "error.validation.missingField" },
          { field: validation }
        ),
        type: Errors.MissingFields,
        data: dataCopy,
      },
    }, port);

    return false;
  }

  let fieldInvalid = false;

  // 3. check if there is an error with email address or zip code
  rules.forEach((rule: string) => {
    if (rule === "emailAddress" && !emailIsValid(data.emailAddress)) {
      postParentMessage(EventType.Error, {
        errorType: "invalidEmail",
        error: intl.formatMessage({ id: "error.validation.emailInvalid" }),
      }, port);

      fieldInvalid = true;
    }

    if (rule === "zip" && !zipIsValid(data.zip, locale)) {
      postParentMessage(EventType.Error, {
        errorType: "invalidZip",
        error: intl.formatMessage({ id: "error.validation.zipInvalid" }),
      }, port);

      fieldInvalid = true;
    }
  });

  if (fieldInvalid) {
    return false;
  }

  postParentMessage(EventType.Validated, {
    validated: true,
  }, port);

  return true;
}

// generic validator to see if characters exist on given field
export function validateInputs(data: any, params: any) {
  let inputValidator = true;
  if (data.exp && data.exp.month && data.exp.year && data.cardNumber && data.cvc) {
    if (params.displayComponents.zipCode) {
      if (!data.validZip) {
        inputValidator = false;
      }
    }
    if (params.displayComponents.firstName) {
      if (!data.firstName) {
        inputValidator = false;
      }
    }
    if (params.displayComponents.lastName) {
      if (!data.lastName) {
        inputValidator = false;
      }
    }
    if (params.displayComponents.emailAddress) {
      if (!data.validEmail) {
        inputValidator = false;
      }
    }
  } else {
    inputValidator = false;
  }
  return inputValidator;
}
