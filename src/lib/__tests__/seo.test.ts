import { describe, expect, it } from "vitest";
import { buildPageMeta } from "../seo";

describe("buildPageMeta", () => {
  it("formats title with site name suffix and clamps length", () => {
    const meta = buildPageMeta({
      title: "AI Voice Agents for Service Businesses",
      description:
        "Voice agents that capture missed calls during peak hours and after hours, qualify leads, and book the job.",
      path: "/services/ai-voice-agent/",
    });
    expect(meta.title).toBe(
      "AI Voice Agents for Service Businesses | Clear Slope Digital",
    );
    expect(meta.canonical).toBe(
      "https://clearslopedigital.com/services/ai-voice-agent/",
    );
    expect(meta.description.length).toBeGreaterThanOrEqual(70);
    expect(meta.description.length).toBeLessThanOrEqual(165);
  });

  it("uses provided ogType (article vs website)", () => {
    const meta = buildPageMeta({
      title: "x",
      description: "x",
      path: "/notes/foo/",
      ogType: "article",
    });
    expect(meta.ogType).toBe("article");
  });

  it("falls back to default OG image when none provided", () => {
    const meta = buildPageMeta({
      title: "x",
      description: "x",
      path: "/",
    });
    expect(meta.ogImage).toContain("/img/");
  });
});
