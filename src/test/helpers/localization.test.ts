import { 
  DEFAULT_LOCALE, 
  getMessages, 
  getLocale, 
  getIntl, 
} from "../../lib/helpers/localization";

import enCA from "../../localization/messages/en-CA.json";

const DEFAULT_MESSAGES = getMessages(DEFAULT_LOCALE);

import {createIntl, createIntlCache} from "react-intl";

describe("Localization Helper Test Suite", () => {
  let languageGetter: jest.SpyInstance<string>;

  beforeEach(() => {
    languageGetter = jest.spyOn(window.navigator, 'language', 'get')
  });

  describe("getLocale", () => {
    it("returns default locale if there is no language in window navigator and no locale value is passed in", () => {
      languageGetter.mockReturnValue("");
      expect(getLocale()).toBe(DEFAULT_LOCALE);
    });

    it("returns window navigator language if messages exists for it and no locale value is passed in", () => {
      languageGetter.mockReturnValue("en-CA");
      expect(getLocale()).toBe("en-CA");
    });

    it("returns default locale if messages for window navigator language not exists and no locale value is passed in", () => {
      languageGetter.mockReturnValue("test");
      expect(getLocale()).toBe(DEFAULT_LOCALE);
    });

    it("returns given locale if messages exist for the given locale", () => {
      languageGetter.mockReturnValue("en-US");
      expect(getLocale("en-CA")).toBe("en-CA");
    });

    it("returns default locale if messages not exist for the given locale", () => {
      languageGetter.mockReturnValue("en-CA");
      expect(getLocale("test")).toBe(DEFAULT_LOCALE);
    });
  });

  describe("getMessages", () => {
    it("getMessages returns messages for the given locale if they exist", () => {
      expect(getMessages("en-CA")).toStrictEqual(enCA);
    });

    it("getMessages returns default messages for the given locale if they not exist", () => {
      expect(getMessages("test")).toStrictEqual(DEFAULT_MESSAGES);
    });
  });

  describe("getIntl", () => {
    it("getIntl returns intl instance with default locale no locale value is passed in", () => {
      const cache = createIntlCache();
      const expected = createIntl({
        locale: DEFAULT_LOCALE,
        defaultLocale: DEFAULT_LOCALE,
        messages: DEFAULT_MESSAGES,
      }, cache);

      const result = getIntl();

      expect(result).toHaveProperty("locale", DEFAULT_LOCALE);
      expect(result).toHaveProperty("defaultLocale", DEFAULT_LOCALE);
      expect(result).toHaveProperty("messages", DEFAULT_MESSAGES);
    });

    it("getIntl returns intl instance with default locale no messages not exist for a given locale", () => {
      const cache = createIntlCache();
      const expected = createIntl({
        locale: DEFAULT_LOCALE,
        defaultLocale: DEFAULT_LOCALE,
        messages: DEFAULT_MESSAGES,
      }, cache);

      const result = getIntl("test");

      expect(result).toHaveProperty("locale", DEFAULT_LOCALE);
      expect(result).toHaveProperty("defaultLocale", DEFAULT_LOCALE);
      expect(result).toHaveProperty("messages", DEFAULT_MESSAGES);
    });

    it("getIntl returns intl instance with a given locale if messages exist", () => {
      const cache = createIntlCache();
      const expected = createIntl({
        locale: "en-CA",
        defaultLocale: DEFAULT_LOCALE,
        messages: enCA,
      }, cache);

      const result = getIntl("en-CA");

      expect(result).toHaveProperty("locale", "en-CA");
      expect(result).toHaveProperty("defaultLocale", "en-US");
      expect(result).toHaveProperty("messages", enCA);
    });
  });
});
