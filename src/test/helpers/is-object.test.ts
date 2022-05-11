import { isObject } from "../../lib/helpers/is-object";

describe("Is Object Helper Test Suite", () => {
  it.each([
    [true, {}],
    [false, []],
    [false, "a"],
    [false, 10],
    [false, true],
    [false, undefined],
    [false, null],
  ])("is-object returns %p if %p is passed in", (expected, data) => {
    const result = isObject(data);
    expect(result).toStrictEqual(expected);
  });
});
