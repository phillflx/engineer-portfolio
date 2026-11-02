import type { ContactChannel, PortfolioProfile } from "../lib/portfolio";
import styles from "./SiteFooter.module.css";

type SiteFooterProps = {
  profile: PortfolioProfile;
  contacts: ContactChannel[];
};

export function SiteFooter({ profile, contacts }: SiteFooterProps) {
  return (
    <footer className={styles.footer} id="contact" aria-labelledby="contact-title">
      <div className={styles.inner}>
        <div>
          <p className={styles.eyebrow}>HAVE A GOOD ONE IN MIND?</p>
          <h2 id="contact-title">Let’s make it <span>real.</span></h2>
        </div>
        <div className={styles.details}>
          {contacts.length > 0 ? (
            <ul>
              {contacts.map((contact) => (
                <li key={`${contact.label}-${contact.href}`}>
                  <a href={contact.href}>{contact.value}<span aria-hidden="true">↗</span></a>
                </li>
              ))}
            </ul>
          ) : (
            <p>Contact details can be configured in the portfolio data.</p>
          )}
        </div>
        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <a href="#hero">BACK TO TOP ↑</a>
        </div>
      </div>
    </footer>
  );
}
