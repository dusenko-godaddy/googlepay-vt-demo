import React, { useState, useEffect, useMemo, ChangeEvent, FocusEvent } from "react";

import { PaymentInputsWrapper, usePaymentInputs } from "react-payment-inputs";
import images from "react-payment-inputs/images";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faAngleDown } from "@fortawesome/free-solid-svg-icons"

import CurrencyFormat from "react-currency-format";
import { v4 as uuidv4 } from "uuid";
import { FormattedMessage, useIntl } from "react-intl";

import {
  authorizeTransaction,
  chargeToken,
  getNonceRequest,
  tokenize,
  ecommerceTransaction,
  validateApplePayRequest,
} from "../../lib/apis/transaction";

import { EventType } from "../../lib/enums/event-type";

import { formatExpiry, formatCard } from "../../lib/helpers/card";
import { path } from "../../lib/helpers/path";
import { postParentMessage } from "../../lib/helpers/post-parent-message";
import {
  transactionStatusToEventType,
  TransactionStatus,
  getCurrencySymbol,
} from "../../lib/helpers/transaction";
import { validateForm, validateInputs, emailIsValid, zipIsValid } from "../../lib/helpers/validator";

import { NoncePayload } from "../../lib/types/nonce-payload";
import { Token } from "../../lib/types/token";
import { TokenizePayload } from "../../lib/types/tokenize-payload";
import { TokenTransactionPayload } from "../../lib/types/token-transaction-payload";
import { TransactionPayload } from "../../lib/types/transaction-payload";
import { Errors } from "../../lib/enums/errors";

import "./PaymentForm.css";

import {
  CreateTransactionOptions,
  CreateTokenOptions,
  CreateTokenTransactionOptions,
  ValidateApplePayOptions,
  GetNonceOptions,
  GetWalletNonceOptions,
  Props,
} from "./PaymentForm.types";
import { MessageData } from "../../lib/types/message-data";
import { ValidateApplePayPayload } from "../../lib/types/validate-applepay-payload";
import useC2Analytics from "./hooks/use-c2-analytics";

export default function PaymentForm(props: Props, ref: any) {
  const intl = useIntl();
  console.log('testing tccl')

  const errorMessages = useMemo(() => {
    return {
      emptyCardNumber: props.errorMessages?.emptyCardNumber || intl.formatMessage({ id: "error.reactPaymentInputs.emptyCardNumber" }),
      emptyExpiryDate: props.errorMessages?.emptyExpiryDate || intl.formatMessage({ id: "error.reactPaymentInputs.emptyExpiryDate" }),
      emptyCVC: props.errorMessages?.emptyCVC || intl.formatMessage({ id: "error.reactPaymentInputs.emptyCVC" }),
      invalidCardNumber: props.errorMessages?.invalidCardNumber || intl.formatMessage({ id: "error.reactPaymentInputs.invalidCardNumber" }),
      invalidExpiryDate: props.errorMessages?.invalidExpiryDate || intl.formatMessage({ id: "error.reactPaymentInputs.invalidExpiryDate" }),
      invalidCVC: props.errorMessages?.invalidCVC || intl.formatMessage({ id: "error.reactPaymentInputs.invalidCVC" }),
      monthOutOfRange: props.errorMessages?.monthOutOfRange || intl.formatMessage({ id: "error.reactPaymentInputs.monthOutOfRange" }),
      yearOutOfRange: props.errorMessages?.yearOutOfRange || intl.formatMessage({ id: "error.reactPaymentInputs.yearOutOfRange" }),
      dateOutOfRange: props.errorMessages?.dateOutOfRange || intl.formatMessage({ id: "error.reactPaymentInputs.dateOutOfRange" }),
    }
  }, [props.errorMessages, intl]);

  const {
    meta,
    getCardNumberProps,
    getCardImageProps,
    getExpiryDateProps,
    getCVCProps,
    wrapperProps,
  } = usePaymentInputs({
    errorMessages: errorMessages
  });

  const showNotes = true;

  const port = props.port;
  const params = props.params;
  const locale = props.locale;
  const currency = props.currency;
  const siftSessionId = props.siftSessionId;

  const passedEmailAddress =
    params.fields && params.fields.emailAddress ? params.fields.emailAddress : "";
  const passedFirstName = params.fields && params.fields.firstName ? params.fields.firstName : "";
  const passedLastName = params.fields && params.fields.lastName ? params.fields.lastName : "";

  const [cardNumber, setCardNumber] = useState("");
  const [expiration, setExpiration] = useState("");
  const [cvc, setCvc] = useState("");
  const [zip, setZip] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState(passedFirstName);
  const [lastName, setLastName] = useState(passedLastName);
  const [emailAddress, setEmailAddress] = useState(passedEmailAddress);
  const [notes, setNotes] = useState("");
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [isTransacting, setIsTransacting] = useState(false);
  const [currentValidationError, setCurrentValidationError] = useState(
    intl.formatMessage({ id: "error.validation.missingDetails" })
  );
  const paymentMethods = params.paymentMethods || ["card"]; // default is card
  const showWalletUI = paymentMethods.includes("apple_pay") || paymentMethods.includes("google_pay"); // TODO: Move wallet UI from collect js to VT
  const showCardUI = paymentMethods.includes("card");

  // flag to show "enter a card number" if they dont focus on the box
  // hack 
  const [showInitialMessage, setShowInitialMessage] = useState(false); 

  useC2Analytics({ error: currentValidationError });

  const firstNameInput = (
    <input
      type="text"
      placeholder={intl.formatMessage({ id: "placeholder.firstName" })}
      value={firstName}
      onChange={(event) => validateFirstName(event.target.value)}
      className="poynt-collect-first-name"
      style={path(params, "style.input.firstName") || path(params, "style.inputDefault")}
    />
  );
  const lastNameInput = (
    <input
      type="text"
      placeholder={intl.formatMessage({ id: "placeholder.lastName" })}
      value={lastName}
      onChange={(event) => validateLastName(event.target.value)}
      className="poynt-collect-last-name"
      style={path(params, "style.input.lastName") || path(params, "style.inputDefault")}
    />
  );
  const emailAddressInput = (
    <input
      type="text"
      placeholder={intl.formatMessage({ id: "placeholder.emailAddress" })}
      value={emailAddress}
      onChange={(event) => validateEmail(event.target.value)}
      className="poynt-collect-email"
      style={path(params, "style.input.email") || path(params, "style.inputDefault")}
    />
  );
  const notesInput = (
    <textarea
      placeholder={intl.formatMessage({ id: "placeholder.notes" })}
      value={notes}
      maxLength={512}
      onChange={(event) => setNotes(event.target.value)}
      className="poynt-collect-notes"
      style={path(params, "style.input.notes") || path(params, "style.inputDefault")}
    />
  );
  const zipInput = (
    <input
      type="text"
      placeholder={intl.formatMessage({ id: "placeholder.zip" })}
      value={zip}
      onChange={(event) => validateZip(event.target.value)}
      className="poynt-collect-zip"
      style={path(params, "style.input.zip") || path(params, "style.inputDefault")}
    />
  );
  const addressInput = (
    <input
      type="text"
      placeholder={intl.formatMessage({ id: "placeholder.address" })}
      value={address}
      onChange={(event) => setAddress(event.target.value)}
      className="poynt-collect-address"
      style={path(params, "style.input.address")}
    />
  );
  const stateInput = (
    <input
      type="text"
      placeholder={intl.formatMessage({ id: "placeholder.state" })}
      value={state}
      onChange={(event) => setState(event.target.value)}
      className="poynt-collect-state"
      style={path(params, "style.input.state")}
    />
  );
  const countryInput = (
    <input
      type="text"
      placeholder={intl.formatMessage({ id: "placeholder.country" })}
      value={country}
      onChange={(event) => setCountry(event.target.value)}
      className="poynt-collect-country"
      style={path(params, "style.input.country")}
    />
  );
  const phoneInput = (
    <input
      type="text"
      placeholder={intl.formatMessage({ id: "placeholder.phone" })}
      value={phone}
      onChange={(event) => setPhone(event.target.value)}
      className="poynt-collect-phone"
      style={path(params, "style.input.phone")}
    />
  );
  const cvcInput = (
    <input
      {...getCVCProps({
        placeholder: intl.formatMessage({ id: "placeholder.cvc" }),
        onChange: (event: ChangeEvent<HTMLInputElement>) => {
          setCvc(event.target.value)
        },
        onBlur: (event: FocusEvent<HTMLInputElement>) => handleError("field", cvc, event.target.value),
      })}
      value={cvc}
      className="poynt-collect-input-cvc"
      style={path(params, "style.inputDefault")}
    />
  );
  const expirationInput = (
    <input
      {...getExpiryDateProps({
        placeholder: intl.formatMessage({ id: "placeholder.expirationDate" }),
        onChange: (event: ChangeEvent<HTMLInputElement>) => setExpiration(event.target.value),
        onBlur: (event: FocusEvent<HTMLInputElement>) => handleError("field", expiration, event.target.value),
      })}
      value={expiration}
      className="poynt-collect-input-exp"
      style={path(params, "style.inputDefault")}
    />
  );
  const cardNumberInput = (
    <input
      {...getCardNumberProps({
        placeholder: intl.formatMessage({ id: "placeholder.cardNumber" }),
        onChange: (event: ChangeEvent<HTMLInputElement>) => setCardNumber(event.target.value),
        onBlur: (event: FocusEvent<HTMLInputElement>) => handleError("field", cardNumber, event.target.value),
      })}
      value={cardNumber}
      className="poynt-collect-input-card"
      style={path(params, "style.inputDefault")}
    />
  );

  /**
   * Initiate an auth or sale transaction using card data.
   * @param createTransactionOptions
   */
  async function createTransaction(createTransactionOptions: CreateTransactionOptions) {
    const transactionDetails: TransactionPayload = {
      number: formatCard(cardNumber),
      exp: formatExpiry(expiration),
      cvc: cvc,
      amount: (createTransactionOptions && createTransactionOptions.amount) || params.amount, // prioritize the passed in values
      firstName: (createTransactionOptions && createTransactionOptions.firstName) || firstName,
      lastName: (createTransactionOptions && createTransactionOptions.lastName) || lastName,
      zip: (createTransactionOptions && createTransactionOptions.zip) || zip,
      emailReceipt: params.emailReceipt,
      authOnly:
        createTransactionOptions.authOnly !== undefined
          ? createTransactionOptions.authOnly
          : params.authOnly,
      applicationId: params.applicationId,
      disablePartialApproval: createTransactionOptions.disablePartialApproval,
      siftSessionId: siftSessionId,
      referenceId: createTransactionOptions.referenceId,
    };

    if (createTransactionOptions.emailAddress) {
      transactionDetails.emailAddress = createTransactionOptions.emailAddress;
    } else if (path(params, "displayComponents.emailAddress")) {
      // prioritize the passed in values
      transactionDetails.emailAddress = emailAddress;
    }

    const rules = ["number", "exp", "cvc", "amount"];

    if (params.displayComponents.zipCode) {
      rules.push("zip");
    }

    if (params.additionalFieldsToValidate && params.additionalFieldsToValidate.length) {
      params.additionalFieldsToValidate.forEach((item: string) => {
        rules.push(item);
      });
    }

    // form validation here
    const isFormValid = validateForm(
      transactionDetails,
      rules,
      currentValidationError,
      locale,
      port
    );

    if (!isFormValid || currentValidationError) {
      return;
    }

    setIsTransacting(true);
    setTransactionSuccess(false);
    try {
      const transaction: any = await authorizeTransaction(params.apiKey, transactionDetails);

      if (
        transaction.status !== TransactionStatus.Declined &&
        transaction.status !== TransactionStatus.Voided &&
        transaction.status !== TransactionStatus.Refunded &&
        params.displayComponents &&
        params.displayComponents.showEndingPage
      ) {
        setTransactionSuccess(true);
      }

      const eventType: EventType = transactionStatusToEventType(transaction.status);
      postParentMessage(eventType, transaction, port);
    } catch (err) {
      postParentMessage(EventType.Error, err, port);
    }
    setIsTransacting(false);
  }

  /**
   * Generate a Collect V1 card token.
   * @param createTokenOptions
   */
  async function createToken(createTokenOptions: CreateTokenOptions) {
    const tokenizePayload: TokenizePayload = {
      number: formatCard(cardNumber),
      exp: formatExpiry(expiration),
      firstName: (createTokenOptions && createTokenOptions.firstName) || firstName,
      lastName: (createTokenOptions && createTokenOptions.lastName) || lastName,
      zip: (createTokenOptions && createTokenOptions.zip) || zip,
      applicationId: params.applicationId,
      type: meta.cardType ? meta.cardType.type.toUpperCase() : "",
      siftSessionId: siftSessionId,
      isTokenTransactionNext: createTokenOptions
        ? createTokenOptions.isTokenTransactionNext
        : false,
    };

    const rules = ["number", "exp", "cvc", "applicationId"];

    if (params.displayComponents.zipCode) {
      rules.push("zip");
    }

    if (params.additionalFieldsToValidate && params.additionalFieldsToValidate.length) {
      params.additionalFieldsToValidate.forEach((item: string) => {
        rules.push(item);
      });
    }

    const isFormValid = validateForm(
      { ...tokenizePayload, cvc: cvc },
      rules,
      currentValidationError,
      locale,
      port
    );

    if (!isFormValid) {
      return;
    }

    try {
      const token: Token = await tokenize(params.apiKey, tokenizePayload);
      postParentMessage(EventType.Token, token, port);
    } catch (err) {
      postParentMessage(EventType.Error, err, port);
    }

    setIsTransacting(false);
  }

  /**
   * Initiate an auth or sale transaction using card token.
   * @param createTokenTransactionOptions
   */
  async function createTokenTransaction(
    createTokenTransactionOptions: CreateTokenTransactionOptions
  ) {
    const tokenTransactionPayload: TokenTransactionPayload = {
      amount: createTokenTransactionOptions.amount,
      token: createTokenTransactionOptions.token,
      customerUserId: createTokenTransactionOptions.customerUserId,
      authOnly:
        createTokenTransactionOptions.authOnly !== undefined
          ? createTokenTransactionOptions.authOnly
          : params.authOnly,
      emailAddress: createTokenTransactionOptions.emailAddress,
      emailReceipt: params.emailReceipt,
    };

    setIsTransacting(true);
    setTransactionSuccess(false);
    try {
      const transaction: any = await chargeToken(params.apiKey, tokenTransactionPayload);

      if (
        transaction.status !== TransactionStatus.Declined &&
        transaction.status !== TransactionStatus.Voided &&
        transaction.status !== TransactionStatus.Refunded &&
        params.displayComponents &&
        params.displayComponents.showEndingPage
      ) {
        setTransactionSuccess(true);
      }

      const eventType: EventType = transactionStatusToEventType(transaction.status);
      postParentMessage(eventType, transaction, port);
    } catch (err) {
      postParentMessage(EventType.Error, err, port);
    }

    setIsTransacting(false);
  }

  /**
   * Get Nonce used to generate Collect V2 card tokenization.
   * @param getNonceOptions
   */
  async function getNonce(getNonceOptions: GetNonceOptions, eventType?: EventType) {

    const noncePayload: NoncePayload = {
      applicationId: params.applicationId,
    };

    const walletToken = showWalletUI && 
      (getNonceOptions.applePayPaymentToken || 
      getNonceOptions.googlePayPaymentToken);

    // card validation and noncePayload prep goes here
    if (showCardUI && !walletToken) {
      const rules = ["number", "exp", "cvc", "applicationId"];

      if (params.displayComponents.zipCode) {
        rules.push("zip");
      }

      if (params.additionalFieldsToValidate && params.additionalFieldsToValidate.length) {
        params.additionalFieldsToValidate.forEach((item: string) => {
          rules.push(item);
        });
      }

      const exp = formatExpiry(expiration);
      const dataToValidate = {
        firstName: getNonceOptions.firstName || firstName,
        lastName: getNonceOptions.lastName || lastName,
        number: formatCard(cardNumber),
        exp,
        cvc: cvc,
        emailAddress: emailAddress,
        zip: getNonceOptions.zip || zip,
        businessId: params.businessId,
        applicationId: params.applicationId,
      };

      handleError("submit");
      const isFormValid = validateForm(
        dataToValidate,
        rules,
        currentValidationError,
        locale,
        port
      );

      if (!isFormValid) {
        postParentMessage(EventType.Validated, {
          validated: isFormValid
        }, port);

        return;
      }

      noncePayload.card = {
        number: formatCard(cardNumber),
        expirationMonth: exp.month,
        expirationYear: 20 + exp.year,
        type: meta.cardType ? meta.cardType.type.toUpperCase() : "",
        cardHolderFirstName: getNonceOptions.firstName || firstName,
        cardHolderLastName: getNonceOptions.lastName || lastName,
      };
      noncePayload.verificationData = {
        cvData: cvc,
        cardHolderBillingAddress: {
          postalCode: getNonceOptions.zip || zip,
          line1: getNonceOptions.line1,
        },
      }
    } else if (walletToken) {
      // wallet validation and noncePayload prep goes here
      if (getNonceOptions.applePayPaymentToken) {
        noncePayload.applePayPaymentToken = getNonceOptions.applePayPaymentToken;
      } else if (getNonceOptions.googlePayPaymentToken) {
        noncePayload.googlePayPaymentToken = getNonceOptions.googlePayPaymentToken;
      }
    } else {
      postParentMessage(EventType.Error, {
        type: Errors.MissingFields,
        error: intl.formatMessage({ id: "error.nonce.missingWalletToken" }),
      }, port);

      return;
    }

    try {
      const nonce: any = await getNonceRequest(
        params.businessId,
        noncePayload,
        getNonceOptions.ssid
      );

      // Deprecated
      if (eventType && eventType === EventType.GetNonce) {
        postParentMessage(transactionStatusToEventType("GetNonce"), nonce, port);
        return;
      }

      postParentMessage(EventType.Nonce, nonce, port);
    } catch (err) {
      postParentMessage(EventType.Error, err, port);
    }
  }

  /**
   * Get Wallet Nonce used to generate Collect V2 tokenization from wallet token.
   * @param getWalletNonceOptions
   */
  async function getWalletNonce(getWalletNonceOptions: GetWalletNonceOptions) {
    const noncePayload: NoncePayload = {
      applicationId: params.applicationId,
    };

    if (!getWalletNonceOptions.applePayPaymentToken && !getWalletNonceOptions.googlePayPaymentToken) {
      postParentMessage(EventType.Error, {
        type: Errors.MissingFields,
        error: intl.formatMessage({ id: "error.nonce.missingWalletToken" }),
      }, port);

      return;
    }

    noncePayload.verificationData = {
      cardHolderBillingAddress: {
        postalCode: getWalletNonceOptions.zip,
        line1: getWalletNonceOptions.line1,
        city: getWalletNonceOptions.city,
        territory: getWalletNonceOptions.territory,
        countryCode: getWalletNonceOptions.countryCode,
      }
    };

    if (getWalletNonceOptions.line2) {
      noncePayload.verificationData.cardHolderBillingAddress.line2 = getWalletNonceOptions.line2;
    }

    if (getWalletNonceOptions.applePayPaymentToken) {
      noncePayload.applePayPaymentToken = getWalletNonceOptions.applePayPaymentToken;
    } else if (getWalletNonceOptions.googlePayPaymentToken) {
      noncePayload.googlePayPaymentToken = getWalletNonceOptions.googlePayPaymentToken;
    }

    try {
      const walletNonce: any = await getNonceRequest(
        params.businessId,
        noncePayload,
        getWalletNonceOptions.ssid
      );

      postParentMessage(EventType.WalletNonce, walletNonce, port);
    } catch (walletNonceError) {
      postParentMessage(EventType.WalletNonceError, walletNonceError, port);
    }
  }

  async function validateApplePay(options: ValidateApplePayOptions) {
    const validationPayload: ValidateApplePayPayload = {
      domainName: options.domainName,
      validationUrl: options.validationUrl,
      displayName: options.displayName,
    }
    try {
      const applePaySession: any = await validateApplePayRequest(
        params.businessId,
        validationPayload,
      );
      postParentMessage(EventType.ValidateApplePay, applePaySession, port);
    } catch (err) {
      postParentMessage(EventType.Error, err, port);
    }
    return;
  }

  async function createEcommerceTransaction(options: any) {
    let exp = formatExpiry(expiration);

    const ecommerceTransactionPayload = options;
    ecommerceTransactionPayload.fundingSource = {
      card: {
        firstName: firstName,
        lastName: lastName,
        number: formatCard(path(options, "card.number") || cardNumber),
        expirationMonth: path(options, "card.expirationMonth") || exp.month,
        expirationYear: 20 + path(options, "card.expirationYear") || 20 + exp.year,
        type:
          path(options, "card.type") ||
          (path(meta, "cardType") ? meta.cardType.type.toUpperCase() : ""),
      },
    };

    // trim off whitespace from email
    ecommerceTransactionPayload.emailAddress = emailAddress.trim();
    ecommerceTransactionPayload.verificationData = {
      cvData: path(options, "verificationData.cvData") || cvc,
      cardHolderBillingAddress: {
        postalCode: path(options, "verificationData.cardHolderBillingAddress.postalCode") || zip,
        // line1:  empty for now
      },
    };

    if (!firstName) {
      postParentMessage(EventType.Error, {
        error: {
          message: intl.formatMessage({ id: "error.ecommerce.firstName" }),
          field: meta || meta.focused,
          meta: meta || "",
          source: "field",
          type: "firstName",
          language: "EN"
        }
      }, port);
      return;
    }

    if (!lastName) {
      postParentMessage(EventType.Error, {
        error: {
          message: intl.formatMessage({ id: "error.ecommerce.lastName" }),
          field: meta || meta.focused,
          meta: meta || "",
          source: "field",
          type: "lastName",
          language: "EN"
        }
      }, port);
      return;
    }

    if (!emailIsValid(emailAddress)) {
      postParentMessage(EventType.Error, {
        error: {
          message: intl.formatMessage({ id: "error.ecommerce.emailAddress" }),
          field: meta || meta.focused,
          meta: meta || "",
          source: "field",
          type: "email",
          language: "EN"
        }
      }, port);
      return;
    }

    if (options && options.amounts && options.amounts.transactionAmount) {
      if (options.amounts.transactionAmount < 100) {
        const formattedAmount = intl.formatNumber(1, {
          style: "currency", 
          currency: currency,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });

        postParentMessage(EventType.Error, {
          errorType: "amountTooLow",
          error: intl.formatMessage({ id: "error.ecommerce.amount" }, { amount: formattedAmount }),
        }, port);
        return;
      }
    }

    ecommerceTransactionPayload.poyntRequestId = uuidv4();
    ecommerceTransactionPayload.businessId = params.businessId;
    if (notes) {
      ecommerceTransactionPayload.notes = notes;
    }

    try {
      setTransactionSuccess(false);
      const transaction: any = await ecommerceTransaction(ecommerceTransactionPayload);
      const eventType: EventType = transactionStatusToEventType("CreateEcommerceTransaction");
      postParentMessage(eventType, transaction, port);
    } catch (err) {
      postParentMessage(EventType.Error, err, port);
    }
  }

  //trigger blur event to show "set a card number" message
  useEffect(() => {
    if (showInitialMessage) {
      getCardNumberProps().ref.current.focus();
      getCardNumberProps().ref.current.blur();
    }
  }, [showInitialMessage, getCardNumberProps]);


  async function handleError(source: string, validatedValue?: string, currentValue?: string) {
    if (!cardNumber && !showInitialMessage) {
      // this is a flag to show "set a card number" if they never click into the card field
      setShowInitialMessage(true);
      return;
    };

    // don"t show error if current input value is differs from the value that was validated in "react-payment-inputs"
    if (validatedValue !== undefined && currentValue !== undefined && validatedValue !== currentValue) {
      return;
    }

    // create an error object 
    let error : any = {};
    error.source = source || "submit";

    if (meta && meta.error) {
      error.message = meta.error;
      error.field = meta.focused;
      error.language = "EN"; // figure this out later todo
      error.meta = meta;
    }

    // check if an actual error exists by checking if meta.error exists (from react-payment-inputs)
    if (error.message) {
      console.log("error", error);
      setCurrentValidationError(error.message);
      postParentMessage(EventType.Error, { error: error }, port);
      return;
    } else {
      setCurrentValidationError("");

      let exp = formatExpiry(expiration);
      let validEmail = emailIsValid(emailAddress.trim());
      let validZip = zipIsValid(zip.trim(), locale);

      let data = {
        exp: exp,
        cvc: cvc,
        cardNumber: cardNumber,
        firstName: firstName,
        lastName: lastName,
        validEmail: validEmail,
        validZip: validZip,
      };

      const validated = validateInputs(data, params);
      postParentMessage(EventType.Validated, { validated }, port);
    }
  }

  // validates and sets email on email change
  async function validateEmail(email: string) {
    setCurrentValidationError("");
    setEmailAddress(email.trim());

    let exp = formatExpiry(expiration);
    let validEmail = emailIsValid(email.trim());
    let validZip = zipIsValid(zip.trim(), locale);

    let data = {
      exp: exp,
      cvc: cvc,
      cardNumber: cardNumber,
      firstName: firstName,
      lastName: lastName,
      validEmail: validEmail,
      validZip: validZip,
    };

    const validated = validateInputs(data, params);
    postParentMessage(EventType.Validated, { validated }, port);
  }

  // validates and sets zip on zip change
  async function validateZip(zip: string) {
    setCurrentValidationError("");
    setZip(zip.trim());

    let exp = formatExpiry(expiration);
    let validEmail = emailIsValid(emailAddress.trim());
    let validZip = zipIsValid(zip.trim(), locale);

    let data = {
      exp: exp,
      cvc: cvc,
      cardNumber: cardNumber,
      firstName: firstName,
      lastName: lastName,
      validEmail: validEmail,
      validZip: validZip,
    };

    const validated = validateInputs(data, params);
    postParentMessage(EventType.Validated, { validated }, port);
  }

  // validates and sets first name on first name change
  async function validateFirstName(firstName: string) {
    setCurrentValidationError("");
    setFirstName(firstName);

    let exp = formatExpiry(expiration);
    let validEmail = emailIsValid(emailAddress.trim());
    let validZip = zipIsValid(zip.trim(), locale);

    let data = {
      exp: exp,
      cvc: cvc,
      cardNumber: cardNumber,
      firstName: firstName,
      lastName: lastName,
      validEmail: validEmail,
      validZip: validZip,
    };

    const validated = validateInputs(data, params);
    postParentMessage(EventType.Validated, { validated }, port);
  }

  // validates and sets last name on last name change
  async function validateLastName(lastName: string) {
    setCurrentValidationError("");
    setLastName(lastName);

    let exp = formatExpiry(expiration);
    let validEmail = emailIsValid(emailAddress.trim());
    let validZip = zipIsValid(zip.trim(), locale);

    let data = {
      exp: exp,
      cvc: cvc,
      cardNumber: cardNumber,
      firstName: firstName,
      lastName: lastName,
      validEmail: validEmail,
      validZip: validZip,
    };

    const validated = validateInputs(data, params);
    postParentMessage(EventType.Validated, { validated }, port);
  }

  // if we ever need to toggle notes like before uncomment this
  // async function toggleNotes() {
    // setShowNotes(!showNotes);
  // }

  useEffect(() => {
    // componentDidMount code which runs only once since it isn't to listening to anything (empty array at the end)
    const eventListener = (event: MessageEvent) => {
      try {
        let eventData: MessageData | null = null;

        if (typeof event?.data === "string") {
          eventData = JSON.parse(event.data);
        } else {
          eventData = event?.data;
        }

        if (!eventData?.type) {
          console.error(intl.formatMessage({ id: "error.event.noEventTypeSpecified" }));
          return;
        }
  
        if (eventData.type === EventType.OpCreateTransaction) {
          createTransaction(eventData.options as CreateTransactionOptions);
        } else if (eventData.type === EventType.OpCreateToken) {
          createToken(eventData.options as CreateTokenOptions);
        } else if (eventData.type === EventType.OpCreateTokenTransaction) {
          createTokenTransaction(eventData.options as CreateTokenTransactionOptions);
        } else if (eventData.type === EventType.OpGetNonce) {
          getNonce(eventData.options as GetNonceOptions);
        } else if (eventData.type === EventType.OpGetWalletNonce) {
          getWalletNonce(eventData.options as GetWalletNonceOptions);
        } else if (eventData.type === EventType.Validated) {
        } else if (eventData.type === EventType.CreateEcommerceTransaction) {
          createEcommerceTransaction(eventData.options as any);
        } else if (eventData.type === EventType.GetNonce) {
          // Deprecated
          getNonce(eventData.options as GetNonceOptions, EventType.GetNonce);
        } else if (eventData.type === EventType.OpValidateApplePay) {
          console.log(
            intl.formatMessage(
              { id: "common.eventTriggered" },
              { event: EventType.OpValidateApplePay }
            )
          );
          validateApplePay(eventData.options as ValidateApplePayOptions);
        }
      } catch {
        console.error(intl.formatMessage({ id: "error.event.invalidEvent" }));
        return;
      }
    };

    window.addEventListener("message", eventListener);
    return () => window.removeEventListener("message", eventListener);
  });

  if (!showCardUI) {
    // TODO: Move wallet UI from collect js to here
    return ( <div className="poynt-collect-payment-form"></div> );
  }

  let payment;
  if (
    path(params, "displayComponents.labels") &&
    path(params, "displayComponents.ecommerceLabels")
  ) {
    payment = (
      <React.Fragment>
        <label className="poynt-collect-payment-row" style={path(params, "style.rowCardNumber")}>
          <span style={path(params, "style.inputLabel")}>
            <FormattedMessage id="label.cardNumber"/>
            <small style={path(params, "style.requiredMark")}>*</small>
          </span>
          <div className="poynt-collect-payment-card-box">
            <svg {...getCardImageProps({ images })} />
            {cardNumberInput}
          </div>
        </label>
        <label className="poynt-collect-payment-row" style={path(params, "style.rowExpiration")}>
          <span style={path(params, "style.inputLabel")}>
            <FormattedMessage id="label.expirationDate"/>
            <small style={path(params, "style.requiredMark")}>*</small>
          </span>
          {expirationInput}
        </label>
        <label className="poynt-collect-payment-row" style={path(params, "style.rowCVV")}>
          <span style={path(params, "style.inputLabel")}>
            <FormattedMessage id="label.cvc"/>
            <small style={path(params, "style.requiredMark")}>*</small>
          </span>
          {cvcInput}
        </label>
        {path(params, "displayComponents.zipCode") ? (
          <label className="poynt-collect-payment-row" style={path(params, "style.rowZip")}>
            <span style={path(params, "style.inputLabel")}>
              <FormattedMessage id="label.zip"/>
              <small style={path(params, "style.requiredMark")}>*</small>
              </span>
            {zipInput}
          </label>
        ) : (
          ""
        )}
      </React.Fragment>
    );
  } else if (path(params, "displayComponents.labels")) {
    payment = (
      <React.Fragment>
        <label className="poynt-collect-payment-row" style={path(params, "style.rowCardNumber")}>
          <span style={path(params, "style.inputLabel")}>
            <FormattedMessage id="label.cardNumber"/>
            <small style={path(params, "style.requiredMark")}>*</small>
          </span>
          <div className="poynt-collect-payment-card-box">
            <svg {...getCardImageProps({ images })} />
            {cardNumberInput}
          </div>
        </label>
        <label className="poynt-collect-payment-row" style={path(params, "style.rowExpiration")}>
          <span style={path(params, "style.inputLabel")}>
            <FormattedMessage id="label.expirationDate"/>
            <small style={path(params, "style.requiredMark")}>*</small>
          </span>
          {expirationInput}
        </label>
        <label className="poynt-collect-payment-row" style={path(params, "style.rowCVV")}>
          <span style={path(params, "style.inputLabel")}>
            <FormattedMessage id="label.cvc"/>
            <small style={path(params, "style.requiredMark")}>*</small>
            </span>
          {cvcInput}
        </label>
        {path(params, "displayComponents.zipCode") ? (
          <label className="poynt-collect-payment-row" style={path(params, "style.rowZip")}>
            <span style={path(params, "style.inputLabel")}>
              <FormattedMessage id="label.zip"/>
              <small style={path(params, "style.requiredMark")}>*</small>
            </span>
            {zipInput}
          </label>
        ) : (
          ""
        )}
      </React.Fragment>
    );
  } else {
    payment = (
      <PaymentInputsWrapper {...wrapperProps} styles={params.style} className="poynt-collect-payments-input-wrapper">
        <svg {...getCardImageProps({ images })} />
        {cardNumberInput}
        {expirationInput}
        {cvcInput}
        {path(params, "displayComponents.zipCode") && <React.Fragment>{zipInput}</React.Fragment>}
      </PaymentInputsWrapper>
    );
  }

  return isTransacting ? (
    // Loading spinner
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  ) : transactionSuccess ? (
    <div id="poynt-indicator">
      <div id="poynt-processed-authorized"></div>
      <div className="poynt-payment-successful">
        <FormattedMessage id="common.paymentSuccessful"/>
      </div>
      <div className="poynt-powered">
        <span className="poynt-powered-text">
          <FormattedMessage id="common.poweredBy"/>
        </span>
        <img
          className="poynt-powered-img"
          src="https://d85ecz8votkqa.cloudfront.net/images/receipts/poynt-white-50.png"
          alt="missing poynt-powered-img"
        />
      </div>
    </div>
  ) : (
    <div className="poynt-collect-payment-form">
      <div
        className={`poynt-collect-payment-container
          ${
            path(params, "displayComponents.showLabels")
              ? "poynt-collect-payment-container-labels"
              : ""
          }`}
        style={path(params, "style.container")}
      >
        {path(params, "displayComponents.firstName") ? (
          path(params, "displayComponents.labels") ? (
            <label className="poynt-collect-payment-row" style={path(params, "style.rowFirstName")}>
              <span style={path(params, "style.inputLabel")}>
                <FormattedMessage id="label.firstName"/>
                <small style={path(params, "style.requiredMark")}>*</small>
              </span>
              {firstNameInput}
            </label>
          ) : (
            <React.Fragment>{firstNameInput}</React.Fragment>
          )
        ) : null}
        {path(params, "displayComponents.lastName") ? (
          path(params, "displayComponents.labels") ? (
            <label className="poynt-collect-payment-row" style={path(params, "style.rowLastName")}>
              <span style={path(params, "style.inputLabel")}>
                <FormattedMessage id="label.lastName"/>
                <small style={path(params, "style.requiredMark")}>*</small>
              </span>
              {lastNameInput}
            </label>
          ) : (
            <React.Fragment>{lastNameInput}</React.Fragment>
          )
        ) : null}

        {path(params, "displayComponents.emailAddress") ? (
          path(params, "displayComponents.labels") ? null : (
            <React.Fragment>{emailAddressInput}</React.Fragment>
          )
        ) : null}

        {path(params, "displayComponents.address") ? (
          path(params, "displayComponents.labels") ? null : (
            <React.Fragment>{addressInput}</React.Fragment>
          )
        ) : null}

        {path(params, "displayComponents.state") ? (
          path(params, "displayComponents.labels") ? null : (
            <React.Fragment>{stateInput}</React.Fragment>
          )
        ) : null}

        {path(params, "displayComponents.country") ? (
          path(params, "displayComponents.labels") ? null : (
            <React.Fragment>{countryInput}</React.Fragment>
          )
        ) : null}

        {path(params, "displayComponents.phone") ? (
          path(params, "displayComponents.labels") ? null : (
            <React.Fragment>{phoneInput}</React.Fragment>
          )
        ) : null}

        {path(params, "displayComponents.paymentLabel") ? (
          <div className="poynt-collect-payment-label" style={path(params, "style.sectionLabel")}>
            <FormattedMessage id="label.paymentLabel.payment"/>
          </div>
        ) : null}

        {payment}

        {path(params, "displayComponents.emailAddress") ? (
          path(params, "displayComponents.labels") ? (
            <label className="poynt-collect-payment-row" style={path(params, "style.rowEmailAddress")}>
              <span style={path(params, "style.inputLabel")}>
                <FormattedMessage id="label.emailAddress"/>
                <small style={path(params, "style.requiredMark")}>*</small>
              </span>
              {emailAddressInput}
            </label>
          ) : null
        ) : null}

        {path(params, "displayComponents.address") ? (
          path(params, "displayComponents.labels") ? (
            <label className="poynt-collect-payment-row" style={path(params, "style.rowAddress")}>
              <span style={path(params, "style.inputLabel")}>
                <FormattedMessage id="label.address"/>
                <small style={path(params, "style.requiredMark")}>*</small>
              </span>
              {addressInput}
            </label>
          ) : null
        ) : null}

        {path(params, "displayComponents.state") ? (
          path(params, "displayComponents.labels") ? (
            <label className="poynt-collect-payment-row" style={path(params, "style.rowState")}>
              <span style={path(params, "style.inputLabel")}>
                <FormattedMessage id="label.state"/>
                <small style={path(params, "style.requiredMark")}>*</small>
              </span>
              {stateInput}
            </label>
          ) : null
        ) : null}

        {path(params, "displayComponents.country") ? (
          path(params, "displayComponents.labels") ? (
            <label className="poynt-collect-payment-row" style={path(params, "style.rowCountry")}>
              <span style={path(params, "style.inputLabel")}>
                <FormattedMessage id="label.country"/>
                <small style={path(params, "style.requiredMark")}>*</small>
              </span>
              {countryInput}
            </label>
          ) : null
        ) : null}

        {path(params, "displayComponents.phone") ? (
          path(params, "displayComponents.labels") ? (
            <label className="poynt-collect-payment-row" style={path(params, "style.rowPhone")}>
              <span style={path(params, "style.inputLabel")}>
                <FormattedMessage id="label.phone"/>
                <small style={path(params, "style.requiredMark")}>*</small>
              </span>
              {phoneInput}
            </label>
          ) : null
        ) : null}

        {path(params, "displayComponents.paymentLabel") ? (
          <div className="poynt-collect-payment-label" style={path(params, "style.sectionLabel")}>
            <FormattedMessage id="label.paymentLabel.contact"/>
          </div>
        ) : null}

        {path(params, "displayComponents.ecommerceFirstName") ? (
          path(params, "displayComponents.labels") ? (
            <label className="poynt-collect-payment-row" style={path(params, "style.rowFirstName")}>
              <span style={path(params, "style.inputLabel")}>
                <FormattedMessage id="label.ecommerceFirstName"/>
                <small style={path(params, "style.requiredMark")}>*</small>
              </span>
              {firstNameInput}
            </label>
          ) : null
        ) : null}

        {path(params, "displayComponents.ecommerceLastName") ? (
          path(params, "displayComponents.labels") ? (
            <label className="poynt-collect-payment-row" style={path(params, "style.rowLastName")}>
              <span style={path(params, "style.inputLabel")}>
                <FormattedMessage id="label.ecommerceLastName"/>
                <small style={path(params, "style.requiredMark")}>*</small>
              </span>
              {lastNameInput}
            </label>
          ) : null
        ) : null}

        {path(params, "displayComponents.ecommerceEmailAddress") ? (
          path(params, "displayComponents.labels") ? (
            <label
              className="poynt-collect-payment-row"
              style={path(params, "style.rowEmailAddress")}
            >
              <span style={path(params, "style.inputLabel")}>
                <FormattedMessage id="label.ecommerceEmailAddress"/>
                <small style={path(params, "style.requiredMark")}>*</small>
              </span>
              {emailAddressInput}
            </label>
          ) : null
        ) : null}

        {path(params, "displayComponents.ecommerceNotes") ? (
          path(params, "displayComponents.labels") ? (
            <div className="poynt-collect-payment-label notes-label">
              <FormattedMessage id="label.paymentLabel.notes"/>
              {/* <span className="poynt-collect-notes-angle-down"  
                onClick={() => {
                  toggleNotes();
              }}>
                <FontAwesomeIcon icon={faAngleDown} />
              </span> */}
            </div>
          ) : null
        ) : null}

        {path(params, "displayComponents.ecommerceNotes") && showNotes ? (
          path(params, "displayComponents.labels") ? (
            <label className="poynt-collect-payment-row" style={path(params, "style.rowNotes")}>
              {notesInput}
            </label>
          ) : null
        ) : null}

        {path(params, "displayComponents.submitButton") && (
          <button
            className="poynt-submit-payment"
            onClick={() => {
              createTransaction({});
            }}
          >
            <FormattedMessage id="common.pay"/>{" "}
            <CurrencyFormat
              value={params.amount / 100}
              displayType="text"
              fixedDecimalScale={true}
              decimalScale={2}
              prefix={getCurrencySymbol(currency)}
            />
          </button>
        )}

        {/* Adds a token button to test tokenize */}
        {path(params, "displayComponents.submitTokenButton") && (
          <button
            className="poynt-tokenize-card"
            style={path(params, "style.buttonTokenize")}
            // disabled={isValidationError || !(!!cvc && !!cardNumber && !!expiration && !!zip)}
            onClick={() => {
              getNonce({});
            }}
          >
            {path(params, "buttonText.submitToken") || <FormattedMessage id="common.getNonce"/>}
          </button>
        )}
      </div>
    </div>
  );
}
