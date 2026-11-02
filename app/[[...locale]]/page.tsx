import type { Metadata } from "next";
import { notFound } from "next/navigation";
import englishJson from "../data/portfolio.en.json";
import portugueseJson from "../data/portfolio.pt-BR.json";
import socialPreview from "../public/images/social-preview.png";
import { HeroCard } from "../components/HeroCard";
import { LocaleChooser } from "../components/LocaleChooser";
import { ProjectsSection } from "../components/ProjectsSection";
import { ServicesSection } from "../components/ServicesSection";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { isLocale, type Locale } from "../lib/locales";
import {
  validateLocalizedPortfolio,
  type LocalizedPortfolio,
} from "../lib/portfolio";

const portfolios: Record<Locale, LocalizedPortfolio> = {
  en: validateLocalizedPortfolio(englishJson, "en"),
  "pt-BR": validateLocalizedPortfolio(portugueseJson, "pt-BR"),
};

type LocalePageProps = {
  params: Promise<{ locale?: string[] }>;
};

export function generateStaticParams() {
  return [
    { locale: [] },
    { locale: ["en"] },
    { locale: ["pt-BR"] },
  ];
}

export const dynamicParams = false;

function getLocale(localeSegments?: string[]): Locale | undefined {
  if (!localeSegments?.length) return undefined;
  if (localeSegments.length !== 1 || !isLocale(localeSegments[0])) {
    notFound();
  }
  return localeSegments[0];
}

export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale: localeSegments } = await params;
  const locale = getLocale(localeSegments);
  if (!locale) {
    return {
      title: "Choose your language | Philipe Felix",
      robots: { index: false, follow: true },
    };
  }

  const { profile, ui } = portfolios[locale];
  const siteOrigin = new URL(profile.canonicalUrl);
  const canonicalUrl = new URL(`/${locale}`, siteOrigin).toString();
  const englishUrl = new URL("/en", siteOrigin).toString();
  const portugueseUrl = new URL("/pt-BR", siteOrigin).toString();
  const configuredSocialImage =
    profile.socialImage === "/images/social-preview.png"
      ? socialPreview.src
      : profile.socialImage ?? socialPreview.src;
  const socialImage = new URL(configuredSocialImage, siteOrigin).toString();

  return {
    metadataBase: siteOrigin,
    title: profile.pageTitle,
    description: profile.metaDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: englishUrl,
        "pt-BR": portugueseUrl,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_US" : "pt_BR",
      alternateLocale: locale === "en" ? ["pt_BR"] : ["en_US"],
      title: profile.pageTitle,
      description: profile.metaDescription,
      url: canonicalUrl,
      images: [
        {
          url: socialImage,
          alt: ui.socialImageAlt,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: profile.pageTitle,
      description: profile.metaDescription,
      images: [socialImage],
    },
  };
}

export default async function HomePage({ params }: LocalePageProps) {
  const { locale: localeSegments } = await params;
  const locale = getLocale(localeSegments);

  if (!locale) return <LocaleChooser />;

  const portfolio = portfolios[locale];
  const { profile, ui } = portfolio;

  return (
    <>
      <SiteHeader locale={locale} ui={ui} />
      <main>
        <HeroCard profile={profile} ui={ui} />
        <ServicesSection services={portfolio.services} ui={ui} />
        <ProjectsSection projects={portfolio.projects} ui={ui} />
      </main>
      <SiteFooter profile={profile} contacts={portfolio.contacts} ui={ui} />
    </>
  );
}
