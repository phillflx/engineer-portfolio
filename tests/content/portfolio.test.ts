import { describe, expect, it } from "vitest";
import { validatePortfolio } from "../../app/lib/portfolio";

const validPortfolio = {
  profile: {
    name: "Your Name",
    role: "Software Engineer",
    introduction: "Building thoughtful digital experiences.",
    primaryAction: {
      label: "Get in touch",
      href: "#contact",
    },
    pageTitle: "Your Name — Software Engineer",
    metaDescription: "Portfolio of a software engineer.",
    canonicalUrl: "https://philipefelix.com/",
    socialImage: "/images/social-preview.svg",
  },
  services: [
    {
      title: "Web application development",
      description: "Accessible, responsive web experiences.",
    },
  ],
  projects: [
    {
      title: "Sample project",
      summary: "A representative project summary.",
      link: "https://example.com/project",
      image: "/images/project.svg",
      imageAlt: "A preview of the sample project",
    },
  ],
  contacts: [
    {
      label: "Email",
      value: "hello@example.com",
      href: "mailto:hello@example.com",
    },
  ],
};

describe("validatePortfolio", () => {
  it("accepts a complete public portfolio", () => {
    expect(validatePortfolio(validPortfolio)).toEqual(validPortfolio);
  });

  it("rejects required strings that are empty after trimming", () => {
    expect(() =>
      validatePortfolio({
        ...validPortfolio,
        profile: { ...validPortfolio.profile, name: "  " },
      }),
    ).toThrow(/profile\.name.*non-empty after trimming/i);
  });

  it("requires an HTTPS canonical URL", () => {
    expect(() =>
      validatePortfolio({
        ...validPortfolio,
        profile: { ...validPortfolio.profile, canonicalUrl: "http://philipefelix.com/" },
      }),
    ).toThrow(/canonicalUrl.*HTTPS/i);
  });

  it("requires a primary action destination to target a section or configured contact", () => {
    expect(() =>
      validatePortfolio({
        ...validPortfolio,
        profile: {
          ...validPortfolio.profile,
          primaryAction: { label: "Explore", href: "#missing" },
        },
      }),
    ).toThrow(/primaryAction.*homepage section or configured contact/i);
  });

  it("rejects service descriptions that are blank", () => {
    expect(() =>
      validatePortfolio({
        ...validPortfolio,
        services: [{ title: "Consulting", description: " " }],
      }),
    ).toThrow(/services\[0\]\.description.*non-empty after trimming/i);
  });

  it("requires project image alternative text when an image is supplied", () => {
    expect(() =>
      validatePortfolio({
        ...validPortfolio,
        projects: [
          {
            title: "Project",
            summary: "A project summary.",
            image: "/images/project.svg",
          },
        ],
      }),
    ).toThrow(/projects\[0\]\.imageAlt/i);
  });

  it("omits unconfigured contact channels", () => {
    const portfolio = validatePortfolio({ ...validPortfolio, contacts: [] });

    expect(portfolio.contacts).toEqual([]);
  });

  it("rejects contact links that do not match their displayed value", () => {
    expect(() =>
      validatePortfolio({
        ...validPortfolio,
        contacts: [
          {
            label: "Email",
            value: "hello@example.com",
            href: "mailto:other@example.com",
          },
        ],
      }),
    ).toThrow(/contacts\[0\]\.href.*match/i);
  });

  it("accepts WhatsApp contacts linked to the matching international phone number", () => {
    const portfolio = validatePortfolio({
      ...validPortfolio,
      contacts: [
        {
          label: "WhatsApp",
          value: "+55 11 995748250",
          href: "https://wa.me/5511995748250",
        },
      ],
    });

    expect(portfolio.contacts[0]).toEqual({
      label: "WhatsApp",
      value: "+55 11 995748250",
      href: "https://wa.me/5511995748250",
    });
  });
});
