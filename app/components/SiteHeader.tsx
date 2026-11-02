import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Main navigation">
        <a className={styles.brand} href="#hero" aria-label="Your Name, home">
          <span aria-hidden="true">YN</span>
          <span className={styles.brandText}>PORTFOLIO<span>.</span></span>
        </a>
        <div className={styles.links}>
          <a href="#services">Services</a>
          <a href="#projects">Projects</a>
          <a className={styles.contactLink} href="#contact">Contact <span aria-hidden="true">↗</span></a>
        </div>
      </nav>
    </header>
  );
}
