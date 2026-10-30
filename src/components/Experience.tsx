'use client';

import { createStyles } from '@mantine/emotion';
import { experiences } from '@/data/experiences';
import { SectionHead } from './SectionHead';

const useStyles = createStyles(() => ({
  role: {
    color: 'var(--ink-2)',
    marginTop: 4,
    marginBottom: 20,
  },
  group: {
    '& + &': {
      marginTop: 16,
    },
  },
  highlights: {
    margin: '6px 0 0',
    paddingLeft: '1.1rem',
    color: 'var(--ink-2)',
    maxWidth: '68ch',
    '& li': {
      marginBottom: 8,
    },
    '& li::marker': {
      color: 'var(--accent)',
    },
  },
}));

export function Experience() {
  return (
    <section id="experience" className="section band" aria-labelledby="experience-title">
      <div className="wrap">
        <SectionHead
          index="02"
          name="experience"
          id="experience-title"
          title="Where I've worked"
          lead="Building products, supporting the people who use them, and keeping the systems behind them running."
        />

        <ExperienceList />
      </div>
    </section>
  );
}

// Shared by the home page and /resume.
export function ExperienceList() {
  const { classes, cx } = useStyles();

  return (
    <ol className="rows">
      {experiences.map((exp) => (
        <li key={exp.company} className="split" style={{ paddingBlock: 36 }}>
          <p className="label">{exp.period}</p>

          <div>
            <h3 className="h3">{exp.company}</h3>
            <p className={cx('mono', classes.role)}>{exp.role}</p>

            {exp.metrics.length > 0 && (
              <dl className="figures" aria-label={`${exp.company} results`}>
                {exp.metrics.map((metric) => (
                  <div key={metric.label}>
                    <dt>{metric.label}</dt>
                    <dd>{metric.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {exp.highlights.map((group) => (
              <div key={group.title} className={classes.group}>
                <h4 className="label">{group.title.toLowerCase()}</h4>
                <ul className={cx('small', classes.highlights)}>
                  {group.items.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}
