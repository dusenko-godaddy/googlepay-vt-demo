import React from "react";
import ReactDOM from "react-dom";
import App from "../../App";

import * as urlParams from "../../lib/helpers/url-params";

jest.mock("react-dom", () => ({ render: jest.fn() }));

const urlParamsMock = "amount=2000&paymentMethods%5B0%5D=google_pay&iFrame%5Bheight%5D=900px&iFrame%5Bwidth%5D=1000px";

describe("Index Component Test Suite", () => {
  const root = document.createElement("div");
  root.id = "root";

  beforeAll(() => {
    jest.spyOn(urlParams, "parseUrlParams");
    jest.spyOn(window, "window", "get").mockImplementation(() => ({
      location: {
        search: "?" + urlParamsMock,
        hostname: "127.0.0.0"
      } as Location
    } as Window & typeof globalThis));

    document.body.appendChild(root);

    require("../../index.tsx");
  });

  it("calls parseUrlParams function with urlParamsMock string", () => {
    expect(urlParams.parseUrlParams).toHaveBeenCalledWith(urlParamsMock);
  });
  
  it("renders App component with urlParams object from urlParamsMock string and root div", () => {
    const expectedUrlParams = {
      amount: "2000",
      paymentMethods: ["google_pay"],
      iFrame: {
        height: "900px",
        width: "1000px"
      }
    };
  
    expect(ReactDOM.render).toHaveBeenCalledWith(<App urlParams={expectedUrlParams} />, root);
  });
});
