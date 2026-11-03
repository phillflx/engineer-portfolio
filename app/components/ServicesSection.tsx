import type { PortfolioUi, ServiceOffering } from "../lib/portfolio";
import { ContentCarousel } from "./ContentCarousel";
import styles from "./ServicesSection.module.css";

type ServicesSectionProps = {
  services: ServiceOffering[];
  ui: PortfolioUi;
};

export function ServicesSection({ services, ui }: ServicesSectionProps) {
  return (
    <section className={styles.section} id="services" aria-labelledby="services-title">
      <div className={styles.heading}>
        <p className={styles.kicker}>{ui.servicesKicker}</p>
        <h2 id="services-title">{ui.servicesTitle}<span>.</span></h2>
      </div>
      <ContentCarousel
        label={ui.servicesCarouselLabel}
        positionLabel={ui.carouselPosition}
        showPosition={false}
        previousLabel={ui.carouselPreviousServices}
        nextLabel={ui.carouselNextServices}
      >
        {services.map((service, index) => (
          <article className={styles.card} key={service.title}>
            <span className={styles.number}>0{index + 1}</span>
            <h3>{service.title}</h3>
            <p>
              <span className={styles.arrow} aria-hidden="true">↗</span>
              {service.description}
            </p>
          </article>
        ))}
      </ContentCarousel>
    </section>
  );
}
