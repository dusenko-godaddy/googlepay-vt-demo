import { getApiserviceUrl } from "../../lib/helpers/api-service-url";

describe("API Service URL Helper Test Suite", () => {
  it.each([
    ["https://services-ci.poynt.net", "vt.local.poynt.net"],
    ["https://services-ci.poynt.net", "vt-ci.poynt.net"],
    ["https://services-test.poynt.net", "vt-test.poynt.net"],
    ["https://services-st.poynt.net", "vt-st.poynt.net"],
    ["https://services-ote.poynt.net", "vt-ote.poynt.net"],
    ["https://services-eu.poynt.net", "vt-eu.poynt.net"],
    ["https://services.poynt.net", "vt.poynt.net"],
    ["https://services.poynt.net", ""],
  ])("getApiserviceUrl returns %p API service URL if %p hostname is passed in", (expected, hostname) => {
    expect(getApiserviceUrl(hostname)).toBe(expected);
  });
});
