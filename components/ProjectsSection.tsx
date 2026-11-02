import type { SampleProject } from "../lib/portfolio";
import { ContentCarousel } from "./ContentCarousel";
import styles from "./ProjectsSection.module.css";

type ProjectsSectionProps = {
  projects: SampleProject[];
};

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section className={styles.section} id="projects" aria-labelledby="projects-title">
      <div className={styles.heading}>
        <p className={styles.kicker}>A FEW THINGS I’VE MADE</p>
        <h2 id="projects-title">Selected work<span>.</span></h2>
      </div>
      <ContentCarousel label="Sample projects">
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
              <span className={styles.number}>PROJECT 0{index + 1}</span>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              {project.link ? (
                <a href={project.link} target="_blank" rel="noreferrer">
                  View project <span aria-hidden="true">↗</span>
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </ContentCarousel>
    </section>
  );
}
