'use client';

import { useState, useEffect, useCallback } from 'react';
import { Modal } from '@mantine/core';
import { createStyles } from '@mantine/emotion';
import Image from 'next/image';
import { IconX, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { projects, Project } from '../data/projects';
import { SectionHead } from './SectionHead';

const useStyles = createStyles(() => ({
  project: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
    gap: 40,
    alignItems: 'start',
    '@media (max-width: 767px)': {
      gridTemplateColumns: '1fr',
      gap: 24,
    },
  },
  compact: {
    gridTemplateColumns: '176px minmax(0, 1fr)',
    gap: 32,
    alignItems: 'center',
    '@media (max-width: 767px)': {
      gridTemplateColumns: '96px minmax(0, 1fr)',
      gap: 20,
      alignItems: 'start',
    },
  },
  compactShot: {
    '@media (max-width: 767px)': {
      aspectRatio: '1',
    },
  },
  compactProse: {
    fontSize: '0.9375rem',
    '@media (max-width: 767px)': {
      display: 'none',
    },
  },
  outcome: {
    color: 'var(--accent)',
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.5,
  },
  shot: {
    position: 'relative',
    display: 'block',
    width: '100%',
    aspectRatio: '16 / 9',
    maxWidth: '100%',
    overflow: 'hidden',
    backgroundColor: 'var(--paper-2)',
    border: '1px solid var(--rule)',
    borderRadius: 'var(--radius)',
    '& img': {
      transition: 'transform 0.4s ease',
    },
    '&:hover img': {
      transform: 'scale(1.02)',
    },
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    minWidth: 0,
  },
  viewer: {
    width: '90vw',
    maxWidth: 960,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  frame: {
    position: 'relative',
    height: '72vh',
    width: '100%',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    padding: '6px 8px',
    backgroundColor: 'var(--paper)',
    border: '1px solid var(--rule-strong)',
    borderRadius: 'var(--radius)',
    color: 'var(--ink)',
  },
  control: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 'var(--radius)',
    '&:hover:not(:disabled)': {
      backgroundColor: 'var(--paper-2)',
    },
    '&:disabled': {
      opacity: 0.35,
      cursor: 'default',
    },
  },
}));

export function Work() {
  const { classes, cx } = useStyles();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);

  const openProject = (project: Project) => {
    if (project.hasModal && project.screenshots && project.screenshots.length > 0) {
      setActiveProject(project);
      setSlideIndex(0);
      setModalOpen(true);
    }
  };

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSlideIndex(0);
  }, []);

  const prev = useCallback(() => {
    if (!activeProject?.screenshots) return;
    setSlideIndex((i) => (i - 1 + activeProject.screenshots!.length) % activeProject.screenshots!.length);
  }, [activeProject]);

  const next = useCallback(() => {
    if (!activeProject?.screenshots) return;
    setSlideIndex((i) => (i + 1) % activeProject.screenshots!.length);
  }, [activeProject]);

  useEffect(() => {
    if (!modalOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [modalOpen, prev, next]);

  useEffect(() => {
    if (!modalOpen) return;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const pad = `${scrollbarWidth}px`;
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.paddingRight = pad;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = pad;
    return () => {
      document.documentElement.style.overflow = '';
      document.documentElement.style.paddingRight = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [modalOpen]);

  const total = activeProject?.screenshots?.length ?? 0;

  return (
    <section id="work" className="section" aria-labelledby="work-title">
      <div className="wrap">
        <SectionHead index="01" name="work" id="work-title" title="Selected work" />

        <ol className="rows">
          {projects.map((project, index) => {
            const count = project.screenshots?.length ?? 0;
            const canOpen = project.hasModal && count > 0;
            const shotClass = cx(classes.shot, project.compact && classes.compactShot);

            return (
              <li
                key={project.title}
                className={cx(classes.project, project.compact && classes.compact)}
                style={{ paddingBlock: 32 }}
              >
                {canOpen ? (
                  <button
                    type="button"
                    className={shotClass}
                    onClick={() => openProject(project)}
                    aria-label={`View ${count} screenshots of ${project.title}`}
                  >
                    <Image
                      src={project.coverUrl}
                      alt=""
                      fill
                      sizes="(max-width: 767px) 100vw, 640px"
                      style={{ objectFit: 'cover', objectPosition: 'top' }}
                    />
                  </button>
                ) : (
                  <div className={shotClass}>
                    <Image
                      src={project.coverUrl}
                      alt={`${project.title} screenshot`}
                      fill
                      sizes="(max-width: 767px) 100vw, 640px"
                      style={{ objectFit: 'cover', objectPosition: 'top' }}
                    />
                  </div>
                )}

                <div className={classes.body}>
                  <p className="label">
                    <strong>{String(index + 1).padStart(2, '0')}</strong>
                    {project.role && ` / ${project.role.toLowerCase()}`}
                  </p>
                  <h3
                    className="h3"
                    style={{ fontSize: project.compact ? '1.375rem' : '1.75rem', fontStretch: '115%', fontWeight: 800 }}
                  >
                    {project.title}
                  </h3>
                  {project.outcome && <p className={classes.outcome}>{project.outcome}</p>}
                  <p className={cx('prose', project.compact && classes.compactProse)}>{project.description}</p>
                  <p className="tags">{project.tags.join(' / ')}</p>
                  <div className="actions">
                    {canOpen && (
                      <button type="button" className="link mono quiet-button" onClick={() => openProject(project)}>
                        View screenshots ({count})
                      </button>
                    )}
                    {project.link && (
                      <a className="link mono quiet-button" href={project.link} target="_blank" rel="noopener noreferrer">
                        Visit site ↗
                      </a>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <Modal
        opened={modalOpen}
        onClose={closeModal}
        withCloseButton={false}
        centered
        lockScroll={false}
        transitionProps={{ transition: 'fade', duration: 150 }}
        size="auto"
        padding={0}
        zIndex={2000}
        title={activeProject ? `${activeProject.title} screenshots` : undefined}
        overlayProps={{ color: '#000', backgroundOpacity: 0.7 }}
        styles={{
          content: { backgroundColor: 'transparent', boxShadow: 'none', overflow: 'visible' },
          header: { display: 'none' },
          body: { padding: 0 },
        }}
      >
        {activeProject && activeProject.screenshots && (
          <div className={classes.viewer}>
            <div className={classes.frame}>
              <Image
                src={activeProject.screenshots[slideIndex]}
                alt={`${activeProject.title} screenshot ${slideIndex + 1} of ${total}`}
                fill
                style={{ objectFit: 'contain' }}
                priority
                sizes="90vw"
              />
            </div>

            <div className={classes.controls}>
              <button
                type="button"
                className={classes.control}
                onClick={prev}
                disabled={total <= 1}
                aria-label="Previous screenshot"
              >
                <IconChevronLeft size={20} stroke={1.5} />
              </button>

              <span className="mono" aria-live="polite">
                {activeProject.title} · {slideIndex + 1} / {total}
              </span>

              <div style={{ display: 'flex', gap: 4 }}>
                <button
                  type="button"
                  className={classes.control}
                  onClick={next}
                  disabled={total <= 1}
                  aria-label="Next screenshot"
                >
                  <IconChevronRight size={20} stroke={1.5} />
                </button>
                <button
                  type="button"
                  className={classes.control}
                  onClick={closeModal}
                  aria-label="Close"
                >
                  <IconX size={18} stroke={1.5} />
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
