import { describe, expect, it } from "vitest";
import {
  buildOrganization,
  buildPerson,
  buildArticle,
  buildService,
  buildFaqPage,
  buildBreadcrumbs,
  buildWebSite,
  buildCollectionPage,
} from "../schema";

describe("buildOrganization", () => {
  it("emits Organization + LocalBusiness with linked @id", () => {
    const node = buildOrganization();
    expect(node["@context"]).toBe("https://schema.org");
    expect(node["@type"]).toEqual(["Organization", "LocalBusiness"]);
    expect(node["@id"]).toBe("https://clearslopedigital.com/#organization");
    expect(node.name).toBe("Clear Slope Digital");
    expect(node.url).toBe("https://clearslopedigital.com");
    expect(node.slogan).toContain("Automated booking & lead capture systems");
    expect(node.address.addressLocality).toBe("Vancouver");
    expect(node.areaServed).toEqual(["CA", "US"]);
    expect(node.sameAs).toContain(
      "https://www.linkedin.com/company/clearslopedigital/",
    );
    expect(node.founder["@id"]).toBe(
      "https://clearslopedigital.com/about/#person",
    );
  });
});

describe("buildPerson", () => {
  it("emits Person with worksFor link to organization", () => {
    const node = buildPerson();
    expect(node["@type"]).toBe("Person");
    expect(node["@id"]).toBe("https://clearslopedigital.com/about/#person");
    expect(node.name).toBe("Mo Habib");
    expect(node.jobTitle).toBe("Founder, Clear Slope Digital");
    expect(node.worksFor["@id"]).toBe(
      "https://clearslopedigital.com/#organization",
    );
    expect(node.knowsAbout).toContain("Automated booking & lead capture systems");
    expect(node.image).toContain("mo-habib");
  });
});

describe("buildArticle", () => {
  it("emits Article with author + publisher links and required fields", () => {
    const node = buildArticle({
      headline: "Test Headline",
      description: "A test article.",
      slug: "/notes/test/",
      datePublished: "2026-05-05",
      dateModified: "2026-05-05",
      image: "https://clearslopedigital.com/img/og.webp",
    });
    expect(node["@type"]).toBe("Article");
    expect(node.headline).toBe("Test Headline");
    expect(node.author["@id"]).toBe(
      "https://clearslopedigital.com/about/#person",
    );
    expect(node.publisher["@id"]).toBe(
      "https://clearslopedigital.com/#organization",
    );
    expect(node.mainEntityOfPage).toBe(
      "https://clearslopedigital.com/notes/test/",
    );
    expect(node.datePublished).toBe("2026-05-05");
  });
});

describe("buildService", () => {
  it("emits Service with provider link and serviceType", () => {
    const node = buildService({
      name: "AI Voice Agents for Service Businesses",
      description: "Custom-built voice agents.",
      slug: "/services/ai-voice-agent/",
      serviceType: "AI Voice Agent",
    });
    expect(node["@type"]).toBe("Service");
    expect(node.provider["@id"]).toBe(
      "https://clearslopedigital.com/#organization",
    );
    expect(node.serviceType).toBe("AI Voice Agent");
    expect(node.areaServed).toEqual(["CA", "US"]);
    expect(node.url).toBe(
      "https://clearslopedigital.com/services/ai-voice-agent/",
    );
  });
});

describe("buildFaqPage", () => {
  it("emits FAQPage with mainEntity Q/A pairs", () => {
    const node = buildFaqPage([
      { q: "What does it cost?", a: "Depends on scope." },
      { q: "How long?", a: "Usually 4 weeks." },
    ]);
    expect(node["@type"]).toBe("FAQPage");
    expect(node.mainEntity).toHaveLength(2);
    expect(node.mainEntity[0]["@type"]).toBe("Question");
    expect(node.mainEntity[0].acceptedAnswer["@type"]).toBe("Answer");
    expect(node.mainEntity[0].acceptedAnswer.text).toBe("Depends on scope.");
  });
});

describe("buildBreadcrumbs", () => {
  it("emits BreadcrumbList with positioned items", () => {
    const node = buildBreadcrumbs([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services/" },
      { name: "AI Voice Agent", path: "/services/ai-voice-agent/" },
    ]);
    expect(node["@type"]).toBe("BreadcrumbList");
    expect(node.itemListElement).toHaveLength(3);
    expect(node.itemListElement[0].position).toBe(1);
    expect(node.itemListElement[2].item).toBe(
      "https://clearslopedigital.com/services/ai-voice-agent/",
    );
  });
});

describe("buildWebSite", () => {
  it("emits WebSite with name and url", () => {
    const node = buildWebSite();
    expect(node["@type"]).toBe("WebSite");
    expect(node.name).toBe("Clear Slope Digital");
    expect(node.url).toBe("https://clearslopedigital.com");
    expect(node.publisher["@id"]).toBe(
      "https://clearslopedigital.com/#organization",
    );
  });
});

describe("buildCollectionPage", () => {
  it("emits CollectionPage with name and url", () => {
    const node = buildCollectionPage({
      name: "Notes",
      slug: "/notes/",
      description: "Posts from Mo.",
    });
    expect(node["@type"]).toBe("CollectionPage");
    expect(node.name).toBe("Notes");
    expect(node.url).toBe("https://clearslopedigital.com/notes/");
  });
});
