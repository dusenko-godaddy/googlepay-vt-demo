import themes from "../../lib/themes/index";

import { parseUrlParams } from "../../lib/helpers/url-params";

describe("URL Params Helper Test Suite", () => {
  describe("parseUrlParams", () => {
    it("returns an empty object from empty string", () => {
      expect(parseUrlParams("")).toStrictEqual({});
    });

    it("returns an object with parsed fields from string", () => {
      const expected = {
        field1: "test1",
        field2: "test2",
      };

      expect(parseUrlParams("field1=test1&field2=test2")).toStrictEqual(expected);
    });

    it("converts fields to booleans if parsed fields from string are equal to true or false", () => {
      const expected = {
        field1: true,
        field2: false,
      };

      expect(parseUrlParams("field1=true&field2=false")).toStrictEqual(expected);
    });

    it("converts displayComponents fields to booleans if parsed displayComponents fields from string are equal to true or false", () => {
      const expected = {
        displayComponents: {
          field1: true,
          field2: false,
        }
      };

      expect(parseUrlParams("displayComponents%5Bfield1%5D=true&displayComponents%5Bfield2%5D=false")).toStrictEqual(expected);
    });

    it("not converts displayComponents fields to booleans if parsed displayComponents fields from string are not equal to true or false", () => {
      const expected = {
        displayComponents: {
          field1: "test1",
          field2: "test2",
        }
      };

      expect(parseUrlParams("displayComponents%5Bfield1%5D=test1&displayComponents%5Bfield2%5D=test2")).toStrictEqual(expected);
    });

    it("not converts displayComponents field to boolean if parsed displayComponents field is not an object", () => {
      const expected = {
        displayComponents: "test"
      };

      expect(parseUrlParams("displayComponents=test")).toStrictEqual(expected);
    });

    it("returns object with merged style field from parsed string with styles from theme if parsed style theme field exists in themes", () => {
      const expected = {
        style: {
          ...themes["customer"],
          theme: "customer",
        }
      };

      expect(parseUrlParams("style%5Btheme%5D=customer")).toStrictEqual(expected);
    });

    it("overrides styles from theme with customCss if parsed style theme field exists in themes and parsed customCss exists", () => {
      const expected = {
        style: {
          ...themes["customer"],
          theme: "customer",
          "rowFirstName": {
            "width": "100%"
          }
        },
        customCss: {
          "rowFirstName": {
            "width": "100%"
          }
        }
      };

      expect(parseUrlParams("style%5Btheme%5D=customer&customCss%5BrowFirstName%5D%5Bwidth%5D=100%25")).toStrictEqual(expected);
    });

    it("returns object with merged style field from parsed string with styles from customCss if parsed style theme field not exists in themes", () => {
      const expected = {
        style: {
          theme: "test",
          "rowFirstName": {
            "width": "100%"
          }
        },
        customCss: {
          "rowFirstName": {
            "width": "100%"
          }
        }
      };

      expect(parseUrlParams("style%5Btheme%5D=test&customCss%5BrowFirstName%5D%5Bwidth%5D=100%25")).toStrictEqual(expected);
    });

    it("returns object with style field with styles from customCss if parsed style field not exists", () => {
      const expected = {
        style: {
          "rowFirstName": {
            "width": "100%"
          }
        },
        customCss: {
          "rowFirstName": {
            "width": "100%"
          }
        }
      };

      expect(parseUrlParams("customCss%5BrowFirstName%5D%5Bwidth%5D=100%25")).toStrictEqual(expected);
    });
  });
});
