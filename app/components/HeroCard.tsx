import type { PortfolioProfile } from "../lib/portfolio";
import styles from "./HeroCard.module.css";

type HeroCardProps = {
  profile: PortfolioProfile;
};

export function HeroCard({ profile }: HeroCardProps) {
  return (
    <section className={styles.hero} id="hero" aria-labelledby="hero-title">
      <div className={styles.grid} aria-hidden="true" />
      <article className={styles.card}>
        <div className={styles.orbit} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className={styles.eyebrow}><span /> AVAILABLE FOR SELECT PROJECTS</p>
        <p className={styles.role}>{profile.role}</p>
        <h1 id="hero-title">
          Hi, I’m <span className={styles.name}>{profile.name}</span>
          <br />
          I build <span className={styles.accent}>digital futures.</span>
        </h1>
        <p className={styles.introduction}>{profile.introduction}</p>
        <a className={styles.action} href={profile.primaryAction.href}>
          {profile.primaryAction.label}<span aria-hidden="true">↗</span>
        </a>
        <span className={styles.index} aria-hidden="true">01 / INTRO</span>
      </article>
      <p className={styles.scrollHint}><span /> SCROLL TO EXPLORE</p>
    </section>
  );
}
