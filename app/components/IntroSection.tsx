import type { PortfolioProfile, PortfolioUi } from "../lib/portfolio";
import styles from "./IntroSection.module.css";

type IntroSectionProps = {
  profile: PortfolioProfile;
  ui: PortfolioUi;
};

export function IntroSection({ profile, ui }: IntroSectionProps) {
  return (
    <section className={styles.intro} id="intro" aria-labelledby="intro-title">
      <div className={styles.grid} aria-hidden="true" />
      <article className={styles.card}>
        <div className={styles.orbit} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className={styles.eyebrow}><span /> {ui.introAvailability}</p>
        <p className={styles.role}>{profile.role}</p>
        <h1 id="intro-title">
          {ui.introGreeting} <span className={styles.name}>{profile.name}</span>
          <br />
          {ui.introHeadline} <span className={styles.accent}>{ui.introAccent}</span>
        </h1>
        <p className={styles.introduction}>{profile.introduction}</p>
        <a className={styles.action} href={profile.primaryAction.href}>
          {profile.primaryAction.label}<span aria-hidden="true">↗</span>
        </a>
        <span className={styles.index} aria-hidden="true">{ui.introIndex}</span>
      </article>
      <p className={styles.scrollHint}><span /> {ui.scrollHint}</p>
    </section>
  );
}
