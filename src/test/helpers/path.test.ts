import { path } from "../../lib/helpers/path";

describe("Path Helper Test Suite", () => {
  it.each([
    [null, "a", "a", null],
    [null, 10, "a", null],
    [null, true, "a", null],
    [null, [], "a", null],
    [null, {}, "a", null],
    ["a", "a", "a", "a"],
    [10, 10, "a", 10],
    [true, true, "a", true],
    [[], [], "a", []],
    [{}, {}, "a", {}],
    [1, {a: 1}, "a", null],
    [{b: {c: "c"}}, {a: {b: {c: "c"}}}, "a", null],
    [{c: "c"}, {a: {b: {c: "c"}}}, "a.b", null],
    ["c", {a: {b: {c: "c"}}}, "a.b.c", null],
    [null, {a: {b: {c: "c"}}}, "a.b.c.d", null],
  ])("path returns %p if source equal to %p, path equal to %p and default key equal to %p", (expected, source, pathToData, defaultKey) => {
    const result = path(source, pathToData, defaultKey);
    expect(result).toStrictEqual(expected);
  });
});
