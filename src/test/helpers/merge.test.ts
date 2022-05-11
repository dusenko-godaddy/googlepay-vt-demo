import { merge } from "../../lib/helpers/merge";

describe("Merge Helper Test Suite", () => {
  it.each([
    [{}, {}, {}],
    ["a", "b", "a"],
    [20, 10, 20],
    [true, false, true],
    [new Date("2022-12-12"), new Date("2022-12-15"), new Date("2022-12-12")],
    ["a", "a", {}],
    [20, 20, {}],
    [true, true, {}],
    [new Date("2022-12-15"), new Date("2022-12-15"), {}],
    [{a: "a"}, {a: "a"}, {a: "a"}],
    [{a: "a", b: "b"}, {a: "a"}, {b: "b"}],
    [{a: {a1: "a1"}, b: "b"}, {a: {a1: "a1"}}, {b: "b"}],
    [{a: {a1: "a1"}, b: "b"}, {b: "b"}, {a: {a1: "a1"}}],
    [{a: {a1: "a1", a2: "a2"}}, {a: {a1: "a1"}}, {a: {a2: "a2"}}],
  ])("merge returns %p if destination equal to %p and source equal to %p", (expected, dest, source) => {
    const result = merge(dest, source);
    expect(result).toStrictEqual(expected);
  });
});
