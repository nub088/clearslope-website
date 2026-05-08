import { describe, expect, it } from "vitest";
import { readingTimeMinutes } from "../reading-time";

describe("readingTimeMinutes", () => {
  it("returns 1 for empty content", () => {
    expect(readingTimeMinutes("")).toBe(1);
  });

  it("rounds up partial minutes (200 words at 225 wpm = 1)", () => {
    const text = Array(200).fill("word").join(" ");
    expect(readingTimeMinutes(text)).toBe(1);
  });

  it("returns 7 for ~1500 words at 225 wpm", () => {
    const text = Array(1500).fill("word").join(" ");
    expect(readingTimeMinutes(text)).toBe(7);
  });

  it("counts whitespace-separated tokens, ignoring markdown punctuation", () => {
    const text = "## Heading\n\nSome **bold** text and a [link](/x).";
    expect(readingTimeMinutes(text)).toBe(1);
  });
});
