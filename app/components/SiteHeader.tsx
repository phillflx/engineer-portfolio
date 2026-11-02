import type { Locale } from "../lib/locales";
import type { PortfolioUi } from "../lib/portfolio";
import { LanguageSelector } from "./LanguageSelector";
import styles from "./SiteHeader.module.css";

type SiteHeaderProps = {
  locale: Locale;
  ui: PortfolioUi;
};

export function SiteHeader({ locale, ui }: SiteHeaderProps) {
  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label={ui.mainNavigationLabel}>
        <a className={styles.brand} href="#intro" aria-label={ui.brandHomeLabel}>
          <span aria-hidden="true">PF</span>
          <span className={styles.brandText}>{ui.brandTitle}<span>.</span></span>
        </a>
        <div className={styles.links}>
          <a href="#services">{ui.navServices}</a>
          <a href="#projects">{ui.navProjects}</a>
          <a className={styles.contactLink} href="#contact">
            {ui.navContact} <span aria-hidden="true">↗</span>
          </a>
        </div>
        <LanguageSelector locale={locale} label={ui.languageSelectorLabel} />
      </nav>
    </header>
  );
}
