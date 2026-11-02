import type { ServiceOffering } from "../lib/portfolio";
import { ContentCarousel } from "./ContentCarousel";
import styles from "./ServicesSection.module.css";

type ServicesSectionProps = {
  services: ServiceOffering[];
};

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section className={styles.section} id="services" aria-labelledby="services-title">
      <div className={styles.heading}>
        <p className={styles.kicker}>WHAT I DO</p>
        <h2 id="services-title">Services<span>.</span></h2>
      </div>
      <ContentCarousel label="Service offerings">
        {services.map((service, index) => (
          <article className={styles.card} key={service.title}>
            <span className={styles.number}>0{index + 1}</span>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <span className={styles.arrow} aria-hidden="true">↗</span>
          </article>
        ))}
      </ContentCarousel>
    </section>
  );
}
