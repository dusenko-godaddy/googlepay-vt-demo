import React from "react";

import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import { IntlProvider } from "react-intl";

import { CurrencyCode } from "../../lib/enums/currency-code";

import { getMessages } from "../../lib/helpers/localization";

import PaymentForm from "../../components/PaymentForm";
import { DisplayComponentsInterface } from "../../components/PaymentForm/PaymentForm.types";

const defaultLocale = "en-US";

const messages = getMessages(defaultLocale);

const defaultOptions = {
  amount: 2000,
  apiKey: "2acea563-4893-4066-8c91-43822895f997",
  businessId: "2acea563-4893-4066-8c91-43822895f997",
  applicationId: "urn:aid:poynt.net",
  iFrame: {
    width: "400px",
    height: "600px",
    border: "1px",
    borderRadius: "4px",
    boxShadow: "0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)",
  },
  style: {
    theme: "example1",
  },
}

const mountComponent = (displayComponents?: DisplayComponentsInterface) => {
  return mount(
    <IntlProvider locale={defaultLocale} defaultLocale={defaultLocale} messages={getMessages(defaultLocale)}>
      <PaymentForm
        params={{
          ...defaultOptions,
          displayComponents: displayComponents || {},
        }}
        currency={CurrencyCode.USD} 
        siftSessionId="1" 
        locale={defaultLocale}
        port={null}
      />
    </IntlProvider>
  );
};

describe("Payment Form Component Test Suite", () => {
  it("Payment Form renders without crashing", () => {
    const container = mountComponent();
    container.unmount();
  });

  test("Payment Form snapshot tests", () => {
    const defaultDispayComponents = mountComponent();
    const allDispayComponents = mountComponent({
      emailAddress: true,
      firstName: true,
      lastName: true,
      zipCode: true,
      address: true,
      state: true,
      country: true,
      phone: true,
      ecommerceFirstName: true,
      ecommerceLastName: true,
      ecommerceEmailAddress: true,
      ecommerceNotes: true,
      submitButton: true,
      submitTokenButton: true,
      showEndingPage: true,
      showLabels: true,
      labels: true,
      ecommerceLabels: true,
      paymentLabel: true
    });

    expect(toJson(defaultDispayComponents)).toMatchSnapshot();
    expect(toJson(allDispayComponents)).toMatchSnapshot();

    defaultDispayComponents.unmount();
    allDispayComponents.unmount();
  });

  // Payment labels
  it("Payment Form renders payment labels", () => {
    const container = mountComponent({
      paymentLabel: true
    });

    const input = container.find(".poynt-collect-payment-label");

    expect(input.length).toEqual(2);

    expect(input.at(0).prop("className")).toEqual("poynt-collect-payment-label");
    expect(input.at(0).text()).toEqual(messages["label.paymentLabel.payment"]);

    expect(input.at(1).prop("className")).toEqual("poynt-collect-payment-label");
    expect(input.at(1).text()).toEqual(messages["label.paymentLabel.contact"]);

    container.unmount();
  });

  // Card number
  it("Payment Form renders card number input without label", () => {
    const container = mountComponent();

    const input = container.find("input.poynt-collect-input-card");

    expect(input.length).toEqual(1);

    expect(input.prop("className")).toEqual("poynt-collect-input-card");
    expect(input.prop("placeholder")).toEqual(messages["placeholder.cardNumber"]);
    expect(input.prop("type")).toEqual("tel");
    expect(input.prop("value")).toEqual("");

    container.unmount();
  });

  it("Payment Form renders card number input with label", () => {
    const container = mountComponent({
      labels: true
    });

    const label = container.find(".poynt-collect-payment-row > span").at(0);
    const input = container.find(".poynt-collect-payment-row input.poynt-collect-input-card");

    expect(label.length).toEqual(1);
    expect(input.length).toEqual(1);

    expect(label.text()).toEqual(messages["label.cardNumber"] + "*");

    expect(input.prop("className")).toEqual("poynt-collect-input-card");
    expect(input.prop("placeholder")).toEqual(messages["placeholder.cardNumber"]);
    expect(input.prop("type")).toEqual("tel");
    expect(input.prop("value")).toEqual("");

    container.unmount();
  });

  // Expiration date
  it("Payment Form renders expiration date input without label", () => {
    const container = mountComponent();

    const input = container.find("input.poynt-collect-input-exp");

    expect(input.length).toEqual(1);

    expect(input.prop("className")).toEqual("poynt-collect-input-exp");
    expect(input.prop("placeholder")).toEqual(messages["placeholder.expirationDate"]);
    expect(input.prop("type")).toEqual("tel");
    expect(input.prop("value")).toEqual("");

    container.unmount();
  });

  it("Payment Form renders expiration date input with label", () => {
    const container = mountComponent({
      labels: true
    });

    const label = container.find(".poynt-collect-payment-row > span").at(1);
    const input = container.find(".poynt-collect-payment-row input.poynt-collect-input-exp");

    expect(label.length).toEqual(1);
    expect(input.length).toEqual(1);

    expect(label.text()).toEqual(messages["label.expirationDate"] + "*");

    expect(input.prop("className")).toEqual("poynt-collect-input-exp");
    expect(input.prop("placeholder")).toEqual(messages["placeholder.expirationDate"]);
    expect(input.prop("type")).toEqual("tel");
    expect(input.prop("value")).toEqual("");

    container.unmount();
  });

  // CVV
  it("Payment Form renders CVV input without label", () => {
    const container = mountComponent();

    const input = container.find("input.poynt-collect-input-cvc");

    expect(input.length).toEqual(1);

    expect(input.prop("className")).toEqual("poynt-collect-input-cvc");
    expect(input.prop("placeholder")).toEqual(messages["placeholder.cvc"]);
    expect(input.prop("type")).toEqual("tel");
    expect(input.prop("value")).toEqual("");

    container.unmount();
  });

  it("Payment Form renders CVV input with label", () => {
    const container = mountComponent({
      labels: true
    });

    const label = container.find(".poynt-collect-payment-row > span").at(2);
    const input = container.find(".poynt-collect-payment-row input.poynt-collect-input-cvc");

    expect(label.length).toEqual(1);
    expect(input.length).toEqual(1);

    expect(label.text()).toEqual(messages["label.cvc"] + "*");

    expect(input.prop("className")).toEqual("poynt-collect-input-cvc");
    expect(input.prop("placeholder")).toEqual(messages["placeholder.cvc"]);
    expect(input.prop("type")).toEqual("tel");
    expect(input.prop("value")).toEqual("");

    container.unmount();
  });

  // Email address
  it("Payment Form does not render email address input if parameter is not passed", () => {
    const container = mountComponent();

    const input = container.find("input.poynt-collect-email");

    expect(input.length).toEqual(0);

    container.unmount();
  });

  it("Payment Form renders email address input without label if parameter is passed", () => {
    const container = mountComponent({
      emailAddress: true
    });

    const input = container.find("input.poynt-collect-email");

    expect(input.length).toEqual(1);

    expect(input.prop("className")).toEqual("poynt-collect-email");
    expect(input.prop("placeholder")).toEqual(messages["placeholder.emailAddress"]);
    expect(input.prop("type")).toEqual("text");

    container.unmount();
  });

  it("Payment Form renders email address input with label if parameter is passed", () => {
    const container = mountComponent({
      labels: true,
      emailAddress: true,
    });

    const label = container.find(".poynt-collect-payment-row > span").at(3);
    const input = container.find(".poynt-collect-payment-row input.poynt-collect-email");

    expect(label.length).toEqual(1);
    expect(input.length).toEqual(1);

    expect(label.text()).toEqual(messages["label.emailAddress"] + "*");

    expect(input.prop("className")).toEqual("poynt-collect-email");
    expect(input.prop("placeholder")).toEqual(messages["placeholder.emailAddress"]);
    expect(input.prop("type")).toEqual("text");
    expect(input.prop("value")).toEqual("");

    container.unmount();
  });

  // First name
  it("Payment Form does not render first name input if parameter is not passed", () => {
    const container = mountComponent();

    const input = container.find("input.poynt-collect-first-name");

    expect(input.length).toEqual(0);

    container.unmount();
  });

  it("Payment Form renders first name input without label if parameter is passed", () => {
    const container = mountComponent({
      firstName: true
    });

    const input = container.find("input.poynt-collect-first-name");

    expect(input.length).toEqual(1);

    expect(input.prop("className")).toEqual("poynt-collect-first-name");
    expect(input.prop("placeholder")).toEqual(messages["placeholder.firstName"]);
    expect(input.prop("type")).toEqual("text");

    container.unmount();
  });

  it("Payment Form renders first name input with label if parameter is passed", () => {
    const container = mountComponent({
      labels: true,
      firstName: true,
    });

    const label = container.find(".poynt-collect-payment-row > span").at(0);
    const input = container.find(".poynt-collect-payment-row input.poynt-collect-first-name");

    expect(label.length).toEqual(1);
    expect(input.length).toEqual(1);

    expect(label.text()).toEqual(messages["label.firstName"] + "*");

    expect(input.prop("className")).toEqual("poynt-collect-first-name");
    expect(input.prop("placeholder")).toEqual(messages["placeholder.firstName"]);
    expect(input.prop("type")).toEqual("text");
    expect(input.prop("value")).toEqual("");

    container.unmount();
  });

  // Last name
  it("Payment Form does not render last name input if parameter is not passed", () => {
    const container = mountComponent();

    const input = container.find("input.poynt-collect-last-name");

    expect(input.length).toEqual(0);

    container.unmount();
  });

  it("Payment Form renders last name input without label if parameter is passed", () => {
    const container = mountComponent({
      lastName: true
    });

    const input = container.find("input.poynt-collect-last-name");

    expect(input.length).toEqual(1);

    expect(input.prop("className")).toEqual("poynt-collect-last-name");
    expect(input.prop("placeholder")).toEqual(messages["placeholder.lastName"]);
    expect(input.prop("type")).toEqual("text");

    container.unmount();
  });

  it("Payment Form renders last name input with label if parameter is passed", () => {
    const container = mountComponent({
      labels: true,
      lastName: true,
    });

    const label = container.find(".poynt-collect-payment-row > span").at(0);
    const input = container.find(".poynt-collect-payment-row input.poynt-collect-last-name");

    expect(label.length).toEqual(1);
    expect(input.length).toEqual(1);

    expect(label.text()).toEqual(messages["label.lastName"] + "*");

    expect(input.prop("className")).toEqual("poynt-collect-last-name");
    expect(input.prop("placeholder")).toEqual(messages["placeholder.lastName"]);
    expect(input.prop("type")).toEqual("text");
    expect(input.prop("value")).toEqual("");

    container.unmount();
  });

  // ZIP
  it("Payment Form does not render ZIP input if parameter is not passed", () => {
    const container = mountComponent();

    const input = container.find("input.poynt-collect-zip");

    expect(input.length).toEqual(0);

    container.unmount();
  });

  it("Payment Form renders ZIP input without label if parameter is passed", () => {
    const container = mountComponent({
      zipCode: true
    });

    const input = container.find("input.poynt-collect-zip");

    expect(input.length).toEqual(1);

    expect(input.prop("className")).toEqual("poynt-collect-zip");
    expect(input.prop("placeholder")).toEqual(messages["placeholder.zip"]);
    expect(input.prop("type")).toEqual("text");

    container.unmount();
  });

  it("Payment Form renders ZIP input with label if parameter is passed", () => {
    const container = mountComponent({
      labels: true,
      zipCode: true,
    });

    const label = container.find(".poynt-collect-payment-row > span").at(3);
    const input = container.find(".poynt-collect-payment-row input.poynt-collect-zip");

    expect(label.length).toEqual(1);
    expect(input.length).toEqual(1);

    expect(label.text()).toEqual(messages["label.zip"] + "*");

    expect(input.prop("className")).toEqual("poynt-collect-zip");
    expect(input.prop("placeholder")).toEqual(messages["placeholder.zip"]);
    expect(input.prop("type")).toEqual("text");
    expect(input.prop("value")).toEqual("");

    container.unmount();
  });

  // Address
  it("Payment Form does not render address input if parameter is not passed", () => {
    const container = mountComponent();

    const input = container.find("input.poynt-collect-address");

    expect(input.length).toEqual(0);

    container.unmount();
  });

  it("Payment Form renders address input without label if parameter is passed", () => {
    const container = mountComponent({
      address: true
    });

    const input = container.find("input.poynt-collect-address");

    expect(input.length).toEqual(1);

    expect(input.prop("className")).toEqual("poynt-collect-address");
    expect(input.prop("placeholder")).toEqual(messages["placeholder.address"]);
    expect(input.prop("type")).toEqual("text");

    container.unmount();
  });

  it("Payment Form renders address input with label if parameter is passed", () => {
    const container = mountComponent({
      labels: true,
      address: true,
    });

    const label = container.find(".poynt-collect-payment-row > span").at(3);
    const input = container.find(".poynt-collect-payment-row input.poynt-collect-address");

    expect(label.length).toEqual(1);
    expect(input.length).toEqual(1);

    expect(label.text()).toEqual(messages["label.address"] + "*");

    expect(input.prop("className")).toEqual("poynt-collect-address");
    expect(input.prop("placeholder")).toEqual(messages["placeholder.address"]);
    expect(input.prop("type")).toEqual("text");
    expect(input.prop("value")).toEqual("");

    container.unmount();
  });

  // State
  it("Payment Form does not render state input if parameter is not passed", () => {
    const container = mountComponent();

    const input = container.find("input.poynt-collect-state");

    expect(input.length).toEqual(0);

    container.unmount();
  });

  it("Payment Form renders state input without label if parameter is passed", () => {
    const container = mountComponent({
      state: true
    });

    const input = container.find("input.poynt-collect-state");

    expect(input.length).toEqual(1);

    expect(input.prop("className")).toEqual("poynt-collect-state");
    expect(input.prop("placeholder")).toEqual(messages["placeholder.state"]);
    expect(input.prop("type")).toEqual("text");

    container.unmount();
  });

  it("Payment Form renders state input with label if parameter is passed", () => {
    const container = mountComponent({
      labels: true,
      state: true,
    });

    const label = container.find(".poynt-collect-payment-row > span").at(3);
    const input = container.find(".poynt-collect-payment-row input.poynt-collect-state");

    expect(label.length).toEqual(1);
    expect(input.length).toEqual(1);

    expect(label.text()).toEqual(messages["label.state"] + "*");

    expect(input.prop("className")).toEqual("poynt-collect-state");
    expect(input.prop("placeholder")).toEqual(messages["placeholder.state"]);
    expect(input.prop("type")).toEqual("text");
    expect(input.prop("value")).toEqual("");

    container.unmount();
  });

  // Country
  it("Payment Form does not render country input if parameter is not passed", () => {
    const container = mountComponent();

    const input = container.find("input.poynt-collect-country");

    expect(input.length).toEqual(0);

    container.unmount();
  });

  it("Payment Form renders country input without label if parameter is passed", () => {
    const container = mountComponent({
      country: true
    });

    const input = container.find("input.poynt-collect-country");

    expect(input.length).toEqual(1);

    expect(input.prop("className")).toEqual("poynt-collect-country");
    expect(input.prop("placeholder")).toEqual(messages["placeholder.country"]);
    expect(input.prop("type")).toEqual("text");

    container.unmount();
  });

  it("Payment Form renders country input with label if parameter is passed", () => {
    const container = mountComponent({
      labels: true,
      country: true,
    });

    const label = container.find(".poynt-collect-payment-row > span").at(3);
    const input = container.find(".poynt-collect-payment-row input.poynt-collect-country");

    expect(label.length).toEqual(1);
    expect(input.length).toEqual(1);

    expect(label.text()).toEqual(messages["label.country"] + "*");

    expect(input.prop("className")).toEqual("poynt-collect-country");
    expect(input.prop("placeholder")).toEqual(messages["placeholder.country"]);
    expect(input.prop("type")).toEqual("text");
    expect(input.prop("value")).toEqual("");

    container.unmount();
  });

  // Phone
  it("Payment Form does not render phone input if parameter is not passed", () => {
    const container = mountComponent();

    const input = container.find("input.poynt-collect-phone");

    expect(input.length).toEqual(0);

    container.unmount();
  });

  it("Payment Form renders phone input without label if parameter is passed", () => {
    const container = mountComponent({
      phone: true
    });

    const input = container.find("input.poynt-collect-phone");

    expect(input.length).toEqual(1);

    expect(input.prop("className")).toEqual("poynt-collect-phone");
    expect(input.prop("placeholder")).toEqual(messages["placeholder.phone"]);
    expect(input.prop("type")).toEqual("text");

    container.unmount();
  });

  it("Payment Form renders phone input with label if parameter is passed", () => {
    const container = mountComponent({
      labels: true,
      phone: true,
    });

    const label = container.find(".poynt-collect-payment-row > span").at(3);
    const input = container.find(".poynt-collect-payment-row input.poynt-collect-phone");

    expect(label.length).toEqual(1);
    expect(input.length).toEqual(1);

    expect(label.text()).toEqual(messages["label.phone"] + "*");

    expect(input.prop("className")).toEqual("poynt-collect-phone");
    expect(input.prop("placeholder")).toEqual(messages["placeholder.phone"]);
    expect(input.prop("type")).toEqual("text");
    expect(input.prop("value")).toEqual("");

    container.unmount();
  });

  // Ecommerce first name
  it("Payment Form does not render ecommerce first name input if parameter is not passed", () => {
    const container = mountComponent();

    const input = container.find("input.poynt-collect-first-name");

    expect(input.length).toEqual(0);

    container.unmount();
  });

  it("Payment Form does not render ecommerce first name input if labels parameter is not passed", () => {
    const container = mountComponent({
      ecommerceFirstName: true
    });

    const input = container.find("input.poynt-collect-first-name");

    expect(input.length).toEqual(0);

    container.unmount();
  });

  it("Payment Form renders ecommerce first name input with label if parameters are passed", () => {
    const container = mountComponent({
      labels: true,
      ecommerceFirstName: true,
    });

    const label = container.find(".poynt-collect-payment-row > span").at(3);
    const input = container.find(".poynt-collect-payment-row input.poynt-collect-first-name");

    expect(label.length).toEqual(1);
    expect(input.length).toEqual(1);

    expect(label.text()).toEqual(messages["label.ecommerceFirstName"] + "*");

    expect(input.prop("className")).toEqual("poynt-collect-first-name");
    expect(input.prop("placeholder")).toEqual(messages["placeholder.firstName"]);
    expect(input.prop("type")).toEqual("text");
    expect(input.prop("value")).toEqual("");

    container.unmount();
  });

  // Ecommerce last name
  it("Payment Form does not render ecommerce last name input if parameter is not passed", () => {
    const container = mountComponent();

    const input = container.find("input.poynt-collect-last-name");

    expect(input.length).toEqual(0);

    container.unmount();
  });

  it("Payment Form does not render ecommerce last name input if labels parameter is not passed", () => {
    const container = mountComponent({
      ecommerceLastName: true
    });

    const input = container.find("input.poynt-collect-last-name");

    expect(input.length).toEqual(0);

    container.unmount();
  });

  it("Payment Form renders ecommerce last name input with label if parameters are passed", () => {
    const container = mountComponent({
      labels: true,
      ecommerceLastName: true,
    });

    const label = container.find(".poynt-collect-payment-row > span").at(3);
    const input = container.find(".poynt-collect-payment-row input.poynt-collect-last-name");

    expect(label.length).toEqual(1);
    expect(input.length).toEqual(1);

    expect(label.text()).toEqual(messages["label.ecommerceLastName"] + "*");

    expect(input.prop("className")).toEqual("poynt-collect-last-name");
    expect(input.prop("placeholder")).toEqual(messages["placeholder.lastName"]);
    expect(input.prop("type")).toEqual("text");
    expect(input.prop("value")).toEqual("");

    container.unmount();
  });

  // Ecommerce email address
  it("Payment Form does not render ecommerce email address input if parameter is not passed", () => {
    const container = mountComponent();

    const input = container.find("input.poynt-collect-email");

    expect(input.length).toEqual(0);

    container.unmount();
  });

  it("Payment Form does not render ecommerce email address input if labels parameter is not passed", () => {
    const container = mountComponent({
      ecommerceEmailAddress: true
    });

    const input = container.find("input.poynt-collect-email");

    expect(input.length).toEqual(0);

    container.unmount();
  });

  it("Payment Form renders ecommerce email address input with label if parameters are passed", () => {
    const container = mountComponent({
      labels: true,
      ecommerceEmailAddress: true,
    });

    const label = container.find(".poynt-collect-payment-row > span").at(3);
    const input = container.find(".poynt-collect-payment-row input.poynt-collect-email");

    expect(label.length).toEqual(1);
    expect(input.length).toEqual(1);

    expect(label.text()).toEqual(messages["label.ecommerceEmailAddress"] + "*");

    expect(input.prop("className")).toEqual("poynt-collect-email");
    expect(input.prop("placeholder")).toEqual(messages["placeholder.emailAddress"]);
    expect(input.prop("type")).toEqual("text");
    expect(input.prop("value")).toEqual("");

    container.unmount();
  });

  // Ecommerce notes
  it("Payment Form does not render ecommerce notes input if parameter is not passed", () => {
    const container = mountComponent();

    const paymentLabel = container.find(".notes-label");
    const textarea = container.find("textarea.poynt-collect-notes");

    expect(paymentLabel.length).toEqual(0);
    expect(textarea.length).toEqual(0);

    container.unmount();
  });

  it("Payment Form does not render ecommerce notes input if labels parameter is not passed", () => {
    const container = mountComponent({
      ecommerceNotes: true
    });

    const paymentLabel = container.find(".notes-label");
    const textarea = container.find("textarea.poynt-collect-notes");

    expect(paymentLabel.length).toEqual(0);
    expect(textarea.length).toEqual(0);

    container.unmount();
  });

  it("Payment Form renders ecommerce notes input with label if parameters are passed", () => {
    const container = mountComponent({
      labels: true,
      ecommerceNotes: true,
    });

    const paymentLabel = container.find(".notes-label");
    const textarea = container.find("textarea.poynt-collect-notes");

    expect(paymentLabel.length).toEqual(1);
    expect(textarea.length).toEqual(1);

    expect(paymentLabel.text()).toEqual(messages["label.paymentLabel.notes"]);

    expect(textarea.prop("className")).toEqual("poynt-collect-notes");
    expect(textarea.prop("placeholder")).toEqual(messages["placeholder.notes"]);
    expect(textarea.prop("value")).toEqual("");

    container.unmount();
  });

  // Submit button
  it("Payment Form does not render submit button if parameter is not passed", () => {
    const container = mountComponent();

    const button = container.find("button.poynt-submit-payment");

    expect(button.length).toEqual(0);

    container.unmount();
  });

  it("Payment Form renders submit button parameter is passed", () => {
    const container = mountComponent({
      submitButton: true
    });

    const button = container.find("button.poynt-submit-payment");

    expect(button.length).toEqual(1);

    expect(button.text()).toEqual(messages["common.pay"] + " $20.00");
    expect(button.prop("className")).toEqual("poynt-submit-payment");

    container.unmount();
  });

  // Submit token button
  it("Payment Form does not render submit token button if parameter is not passed", () => {
    const container = mountComponent();

    const button = container.find("button.poynt-tokenize-card");

    expect(button.length).toEqual(0);

    container.unmount();
  });

  it("Payment Form renders submit token button parameter is passed", () => {
    const container = mountComponent({
      submitTokenButton: true
    });

    const button = container.find("button.poynt-tokenize-card");

    expect(button.length).toEqual(1);

    expect(button.text()).toEqual(messages["common.getNonce"]);
    expect(button.prop("className")).toEqual("poynt-tokenize-card");

    container.unmount();
  });
});
