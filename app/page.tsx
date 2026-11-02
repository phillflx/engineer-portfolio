import type { Metadata } from "next";
import portfolioJson from "../data/portfolio.json";
import { HeroCard } from "../components/HeroCard";
import { ProjectsSection } from "../components/ProjectsSection";
import { ServicesSection } from "../components/ServicesSection";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { validatePortfolio } from "../lib/portfolio";

const portfolio = validatePortfolio(portfolioJson);
const { profile } = portfolio;
const socialImage = profile.socialImage
  ? new URL(profile.socialImage, profile.canonicalUrl).toString()
  : undefined;

export const metadata: Metadata = {
  metadataBase: new URL(profile.canonicalUrl),
  title: profile.pageTitle,
  description: profile.metaDescription,
  alternates: {
    canonical: profile.canonicalUrl,
  },
  openGraph: {
    type: "website",
    title: profile.pageTitle,
    description: profile.metaDescription,
    url: profile.canonicalUrl,
    images: socialImage ? [{ url: socialImage, alt: `${profile.name} portfolio preview` }] : [],
  },
  twitter: {
    card: "summary_large_image",
    title: profile.pageTitle,
    description: profile.metaDescription,
    images: socialImage ? [socialImage] : [],
  },
};

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroCard profile={profile} />
        <ServicesSection services={portfolio.services} />
        <ProjectsSection projects={portfolio.projects} />
      </main>
      <SiteFooter profile={profile} contacts={portfolio.contacts} />
    </>
  );
}
