export type PrimaryAction = {
  label: string;
  href: string;
};

export type PortfolioProfile = {
  name: string;
  role: string;
  introduction: string;
  primaryAction: PrimaryAction;
  pageTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  socialImage?: string;
};

export type ServiceOffering = {
  title: string;
  description: string;
};

export type SampleProject = {
  title: string;
  summary: string;
  link?: string;
  image?: string;
  imageAlt?: string;
};

export type ContactChannel = {
  label: string;
  value: string;
  href: string;
};

export type PortfolioData = {
  profile: PortfolioProfile;
  services: ServiceOffering[];
  projects: SampleProject[];
  contacts: ContactChannel[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isHttpsUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;

  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isPublicAssetPath(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//");
}

function isAssetReference(value: unknown): value is string {
  return isPublicAssetPath(value) || isHttpsUrl(value);
}

function fail(path: string, requirement: string): never {
  throw new Error(`Invalid portfolio data: ${path} ${requirement}.`);
}

function requiredString(
  record: Record<string, unknown>,
  key: string,
  path: string,
): string {
  const value = record[key];
  if (!isNonEmptyString(value)) {
    return fail(`${path}.${key}`, "must be non-empty after trimming");
  }
  return value.trim();
}

function parseProfile(value: unknown): PortfolioProfile {
  if (!isRecord(value)) return fail("profile", "must be an object");

  const action = value.primaryAction;
  if (!isRecord(action)) {
    return fail("profile.primaryAction", "must be an object");
  }

  const socialImage = value.socialImage;
  if (socialImage !== undefined && !isAssetReference(socialImage)) {
    return fail("profile.socialImage", "must be a site-relative path or absolute HTTPS URL");
  }

  return {
    name: requiredString(value, "name", "profile"),
    role: requiredString(value, "role", "profile"),
    introduction: requiredString(value, "introduction", "profile"),
    primaryAction: {
      label: requiredString(action, "label", "profile.primaryAction"),
      href: requiredString(action, "href", "profile.primaryAction"),
    },
    pageTitle: requiredString(value, "pageTitle", "profile"),
    metaDescription: requiredString(value, "metaDescription", "profile"),
    canonicalUrl: isHttpsUrl(value.canonicalUrl)
      ? value.canonicalUrl
      : fail("profile.canonicalUrl", "must be a valid HTTPS URL for the public homepage"),
    ...(socialImage === undefined ? {} : { socialImage }),
  };
}

function parseServices(value: unknown): ServiceOffering[] {
  if (!Array.isArray(value) || value.length === 0) {
    return fail("services", "must contain at least one service offering");
  }

  return value.map((item, index) => {
    const path = `services[${index}]`;
    if (!isRecord(item)) return fail(path, "must be an object");
    return {
      title: requiredString(item, "title", path),
      description: requiredString(item, "description", path),
    };
  });
}

function parseProjects(value: unknown): SampleProject[] {
  if (!Array.isArray(value) || value.length === 0) {
    return fail("projects", "must contain at least one sample project");
  }

  return value.map((item, index) => {
    const path = `projects[${index}]`;
    if (!isRecord(item)) return fail(path, "must be an object");

    const link = item.link;
    if (link !== undefined && !isHttpsUrl(link)) {
      return fail(`${path}.link`, "must be a valid HTTPS URL");
    }

    const image = item.image;
    if (image !== undefined && !isAssetReference(image)) {
      return fail(`${path}.image`, "must be a site-relative path or absolute HTTPS URL");
    }

    const imageAlt = item.imageAlt;
    if (image !== undefined && typeof imageAlt !== "string") {
      return fail(`${path}.imageAlt`, "is required when an image is supplied");
    }
    if (imageAlt !== undefined && typeof imageAlt !== "string") {
      return fail(`${path}.imageAlt`, "must be a string");
    }

    return {
      title: requiredString(item, "title", path),
      summary: requiredString(item, "summary", path),
      ...(link === undefined ? {} : { link }),
      ...(image === undefined ? {} : { image }),
      ...(imageAlt === undefined ? {} : { imageAlt: imageAlt.trim() }),
    };
  });
}

function parseContacts(value: unknown): ContactChannel[] {
  if (!Array.isArray(value)) return fail("contacts", "must be an array");

  return value.map((item, index) => {
    const path = `contacts[${index}]`;
    if (!isRecord(item)) return fail(path, "must be an object");

    const label = requiredString(item, "label", path);
    const contactValue = requiredString(item, "value", path);
    const href = requiredString(item, "href", path);
    const matchesEmail = contactValue.includes("@") && href === `mailto:${contactValue}`;
    const matchesProfile = isHttpsUrl(contactValue) && href === contactValue;
    const phoneDigits = contactValue.replace(/\D/g, "");
    const matchesWhatsApp =
      label === "WhatsApp" &&
      /^\+\d[\d ]+$/.test(contactValue) &&
      href === `https://wa.me/${phoneDigits}`;

    if (!matchesEmail && !matchesProfile && !matchesWhatsApp) {
      return fail(`${path}.href`, "must match its displayed contact value");
    }

    return { label, value: contactValue, href };
  });
}

export function validatePortfolio(value: unknown): PortfolioData {
  if (!isRecord(value)) return fail("portfolio", "must be an object");

  const profile = parseProfile(value.profile);
  const services = parseServices(value.services);
  const projects = parseProjects(value.projects);
  const contacts = parseContacts(value.contacts);
  const actionHref = profile.primaryAction.href;
  const validAnchors = new Set(["#hero", "#services", "#projects", "#contact"]);

  if (
    !validAnchors.has(actionHref) &&
    !contacts.some((contact) => contact.href === actionHref)
  ) {
    return fail(
      "profile.primaryAction.href",
      "must target a homepage section or configured contact",
    );
  }

  return { profile, services, projects, contacts };
}
