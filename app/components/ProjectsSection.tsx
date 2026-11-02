import type { PortfolioUi, SampleProject } from "../lib/portfolio";
import { ContentCarousel } from "./ContentCarousel";
import styles from "./ProjectsSection.module.css";

type ProjectsSectionProps = {
  projects: SampleProject[];
  ui: PortfolioUi;
};

export function ProjectsSection({ projects, ui }: ProjectsSectionProps) {
  return (
    <section className={styles.section} id="projects" aria-labelledby="projects-title">
      <div className={styles.heading}>
        <p className={styles.kicker}>{ui.projectsKicker}</p>
        <h2 id="projects-title">{ui.projectsTitle}<span>.</span></h2>
      </div>
      <ContentCarousel
        label={ui.projectsCarouselLabel}
        positionLabel={ui.carouselPosition}
        showPosition={false}
        previousLabel={ui.carouselPreviousProjects}
        nextLabel={ui.carouselNextProjects}
      >
        {projects.map((project, index) => (
          <article className={styles.card} key={project.title}>
            <div className={styles.imageFrame}>
              {project.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.image} alt={project.imageAlt ?? ""} />
              ) : (
                <div className={styles.imagePlaceholder} aria-hidden="true">
                  <span>0{index + 1}</span>
                </div>
              )}
            </div>
            <div className={styles.copy}>
              <span className={styles.number}>
                {ui.projectIndex.replace("{index}", String(index + 1).padStart(2, "0"))}
              </span>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              {project.link ? (
                <a href={project.link} target="_blank" rel="noreferrer">
                  {ui.projectLink} <span aria-hidden="true">↗</span>
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </ContentCarousel>
    </section>
  );
}
