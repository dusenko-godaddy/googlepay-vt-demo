import { formatExpiry, formatCard } from "../../lib/helpers/card";

describe("Card Helper Test Suite", () => {
  describe("formatExpiry", () => {
    it("returns object with expiration month and year fields filled in if string with expiration month and year is passed", () => {
      const expected = {
        month: "12",
        year: "24"
      };

      expect(formatExpiry("12/24")).toStrictEqual(expected);
    });

    it("returns object with expiration month and year fields trimmed and filled in if string with expiration month and year is passed with spaces", () => {
      const expected = {
        month: "12",
        year: "24"
      };

      expect(formatExpiry("  12  /  24  ")).toStrictEqual(expected);
    });

    it("returns object with expiration month field filled in and year field empty if string with only expiration month is passed", () => {
      const expected = {
        month: "12",
        year: ""
      };

      expect(formatExpiry("12")).toStrictEqual(expected);
    });

    it("returns object with expiration month field empty and year field filled in if string with only expiration year is passed", () => {
      const expected = {
        month: "",
        year: "24"
      };

      expect(formatExpiry("/24")).toStrictEqual(expected);
    });

    it("returns object with empty expiration month and year fields if empty string is passed", () => {
      const expected = {
        month: "",
        year: ""
      };

      expect(formatExpiry("")).toStrictEqual(expected);
    });
  });

  describe("formatCard", () => {
    it("returns string without spaces if card number string with single spaces is passed", () => {
      expect(formatCard("4242 4242 4242 4242")).toBe("4242424242424242");
    });

    it("returns string without spaces if card number string with multiple spaces is passed", () => {
      expect(formatCard("  4242    4242  4242  4242   ")).toBe("4242424242424242");
    });

    it("returns string without spaces if empty card number string with spaces is passed", () => {
      expect(formatCard("   ")).toBe("");
    });
  });
});
