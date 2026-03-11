import { describe, expect, it } from "vitest";
import { formatCurrency, formatDuration } from "./format";

describe("format utilities", () => {
  it("formats currency from cents", () => {
    expect(formatCurrency(12345, "USD")).toContain("123.45");
  });

  it("formats duration from seconds", () => {
    expect(formatDuration(215)).toBe("03:35");
    expect(formatDuration(null)).toBe("--:--");
  });
});
