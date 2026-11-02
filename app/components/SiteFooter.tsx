import type {
  ContactChannel,
  PortfolioProfile,
  PortfolioUi,
} from "../lib/portfolio";
import styles from "./SiteFooter.module.css";

type SiteFooterProps = {
  profile: PortfolioProfile;
  contacts: ContactChannel[];
  ui: PortfolioUi;
};

export function SiteFooter({ profile, contacts, ui }: SiteFooterProps) {
  return (
    <footer className={styles.footer} id="contact" aria-labelledby="contact-title">
      <div className={styles.inner}>
        <div>
          <p className={styles.eyebrow}>{ui.footerEyebrow}</p>
          <h2 id="contact-title">{ui.footerTitle} <span>{ui.footerAccent}</span></h2>
        </div>
        <div className={styles.details}>
          {contacts.length > 0 ? (
            <ul>
              {contacts.map((contact) => (
                <li key={`${contact.label}-${contact.href}`}>
                  <a href={contact.href}>
                    <span className={styles.contactLabel}>{contact.label}</span>
                    <span className={styles.contactValue}>{contact.value}</span>
                    <span className={styles.contactArrow} aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>{ui.emptyContacts}</p>
          )}
        </div>
        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <a href="#hero">{ui.backToTop} ↑</a>
        </div>
      </div>
    </footer>
  );
}
