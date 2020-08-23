const { calculateQuarter, calcDstCoordinate } = require("../navigation/index");
const { expect, describe, it } = require("@jest/globals");

describe("movement calculations", () => {
  it("should return quarter for forward and right", () => {
    expect(calculateQuarter({ x: 20, y: 50 })).toStrictEqual([
      { direction: "right", distance: 20 },
      { direction: "forward", distance: 50 },
    ]);
  });

  it("should return quarter and ignore left (distance is less then 20)", () => {
    expect(calculateQuarter({ x: -10, y: 40 })).toStrictEqual([
      { direction: "forward", distance: 40 },
    ]);
  });

  it("should return quarter and ignore forward (distance is less then 20)", () => {
    expect(calculateQuarter({ x: -20, y: 10 })).toStrictEqual([
      { direction: "left", distance: 20 },
    ]);
  });

  it("should return no location change (distance in both directions in less then 20)", () => {
    expect(calculateQuarter({ x: -10, y: 10 })).toEqual([]);
  });
});
