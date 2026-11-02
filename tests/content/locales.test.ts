import { describe, expect, it } from "vitest";
import englishJson from "../../app/data/portfolio.en.json";
import portugueseJson from "../../app/data/portfolio.pt-BR.json";
import { validateLocalizedPortfolio } from "../../app/lib/portfolio";

describe("validateLocalizedPortfolio", () => {
  it("accepts complete English and Brazilian Portuguese portfolios", () => {
    expect(validateLocalizedPortfolio(englishJson, "en").locale).toBe("en");
    expect(validateLocalizedPortfolio(portugueseJson, "pt-BR").locale).toBe(
      "pt-BR",
    );
  });

  it("keeps contact values and links consistent between locales", () => {
    const english = validateLocalizedPortfolio(englishJson, "en");
    const portuguese = validateLocalizedPortfolio(portugueseJson, "pt-BR");

    expect(portuguese.contacts.map(({ value, href }) => ({ value, href }))).toEqual(
      english.contacts.map(({ value, href }) => ({ value, href })),
    );
  });

  it("rejects a dataset whose locale does not match the route", () => {
    expect(() => validateLocalizedPortfolio(englishJson, "pt-BR")).toThrow(
      /locale.*match.*pt-BR/i,
    );
  });

  it("rejects missing localized UI strings", () => {
    expect(() =>
      validateLocalizedPortfolio(
        {
          ...englishJson,
          ui: { ...englishJson.ui, navContact: " " },
        },
        "en",
      ),
    ).toThrow(/ui\.navContact.*non-empty after trimming/i);
  });

  it("does not use English labels to validate localized WhatsApp contact links", () => {
    const localized = validateLocalizedPortfolio(
      {
        ...portugueseJson,
        contacts: portugueseJson.contacts.map((contact) =>
          contact.href.startsWith("https://wa.me/")
            ? { ...contact, label: "WhatsApp" }
            : contact,
        ),
      },
      "pt-BR",
    );

    expect(localized.contacts.at(-1)?.href).toBe(
      "https://wa.me/5511995748250",
    );
  });
});
