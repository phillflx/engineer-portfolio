import type { PortfolioProfile, PortfolioUi } from "../lib/portfolio";
import styles from "./HeroCard.module.css";

type HeroCardProps = {
  profile: PortfolioProfile;
  ui: PortfolioUi;
};

export function HeroCard({ profile, ui }: HeroCardProps) {
  return (
    <section className={styles.hero} id="hero" aria-labelledby="hero-title">
      <div className={styles.grid} aria-hidden="true" />
      <article className={styles.card}>
        <div className={styles.orbit} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className={styles.eyebrow}><span /> {ui.heroAvailability}</p>
        <p className={styles.role}>{profile.role}</p>
        <h1 id="hero-title">
          {ui.heroGreeting} <span className={styles.name}>{profile.name}</span>
          <br />
          {ui.heroHeadline} <span className={styles.accent}>{ui.heroAccent}</span>
        </h1>
        <p className={styles.introduction}>{profile.introduction}</p>
        <a className={styles.action} href={profile.primaryAction.href}>
          {profile.primaryAction.label}<span aria-hidden="true">↗</span>
        </a>
        <span className={styles.index} aria-hidden="true">{ui.heroIndex}</span>
      </article>
      <p className={styles.scrollHint}><span /> {ui.scrollHint}</p>
    </section>
  );
}
