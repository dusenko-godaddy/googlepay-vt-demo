import React from "react";
import { mount } from "enzyme";

import App from "../../App";

describe("App Component Test Suite", () => {
  it("App component renders without crashing", () => {
    mount(<App urlParams={{}}/>);
  });
});
