import { SITE_URL, ORG_ID, ORG_ADDRESS } from "./site";

export const AUTHOR_ID = `${SITE_URL}/about/#person`;

export const AUTHOR = {
  id: AUTHOR_ID,
  name: "Mo Habib",
  jobTitle: "Founder, Clear Slope Digital",
  url: `${SITE_URL}/about/`,
  image: `${SITE_URL}/img/mo-habib.jpeg`,
  imagePath64: "/img/mo-habib-64.webp",
  imagePath160: "/img/mo-habib-160.webp",
  imagePath400: "/img/mo-habib-400.webp",
  worksForId: ORG_ID,
  address: ORG_ADDRESS,
  sameAs: ["https://www.linkedin.com/company/clearslopedigital/"] as const,
  knowsAbout: [
    "AI voice agents",
    "Agentic workflows",
    "Local SEO",
    "Service-business operations",
    "LLM application engineering",
    "Conversion rate optimization",
  ] as const,
  shortBio:
    "Mo Habib builds AI voice agents, agentic workflows, and local SEO systems for service businesses across Canada and the US. Engineering background, systems thinker, working founder-direct.",
} as const;
