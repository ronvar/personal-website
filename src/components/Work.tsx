'use client';

import { useState, useEffect, useCallback } from 'react';
import { Box, Title, Text, Card, Container, Grid, Badge, Group, Modal, ActionIcon } from '@mantine/core';
import Image from 'next/image';
import { IconExternalLink, IconX, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { FadeIn } from './FadeIn';
import { projects, Project } from '../data/projects';

export function Work() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [hovered, setHovered] = useState<'prev' | 'next' | 'close' | null>(null);

  const handleProjectClick = (project: Project) => {
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
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [modalOpen, prev, next, closeModal]);

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

  return (
    <Box
      component="section"
      id="work"
      style={{
        backgroundColor: 'var(--gray-100)',
      }}
    >
      <Container size="lg">
        <FadeIn>
          <Text
            size="sm"
            tt="uppercase"
            fw={600}
            c="blue"
            mb="xs"
            style={{ letterSpacing: '0.1em' }}
          >
            Portfolio
          </Text>
          <Title order={2} size="2.5rem" mb="xl">
            Featured Work
          </Title>
        </FadeIn>

        <Grid gutter="xl">
          {projects.map((project, index) => {
            const isLast = index === projects.length - 1;
            const isOddTotal = projects.length % 2 !== 0;
            const span = (isLast && isOddTotal) ? 12 : 6;

            const cardContent = (
              <Card
                padding={0}
                radius="lg"
                style={{
                  height: '100%',
                  overflow: 'hidden',
                  border: '1px solid var(--gray-200)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: project.link || project.hasModal ? 'pointer' : 'default',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={() => handleProjectClick(project)}
              >
                <Box
                  style={{
                    background: project.coverUrl ? 'transparent' : project.gradient,
                    height: 160,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  {project.coverUrl && (
                    <>
                      <Image
                        src={project.coverUrl}
                        alt={project.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                      <Box
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'radial-gradient(circle, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 100%)',
                        }}
                      />
                    </>
                  )}
                  <Text
                    size="xl"
                    fw={700}
                    c="white"
                    style={{
                      textShadow: '0 2px 4px rgba(0,0,0,0.4)',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {project.title}
                  </Text>
                </Box>
                <Box p="lg" style={{ backgroundColor: 'var(--background)', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Group justify="space-between" mb="xs">
                    <Text fw={600} size="lg">
                      {project.title}
                    </Text>
                    {project.link && <IconExternalLink size={18} style={{ color: 'var(--gray-400)' }} />}
                  </Group>
                  <Text size="sm" c="dimmed" mb="md" style={{ lineHeight: 1.6, flexGrow: 1 }}>
                    {project.description}
                  </Text>
                  <Group gap="xs">
                    {project.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="light"
                        color="gray"
                        size="sm"
                        radius="sm"
                        style={{ textTransform: 'none' }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </Group>
                </Box>
              </Card>
            );

            return (
              <Grid.Col key={project.title} span={{ base: 12, sm: span }}>
                <FadeIn delay={index * 100} style={{ height: '100%' }}>
                  {project.link ? (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', height: '100%', display: 'block' }}>
                      {cardContent}
                    </a>
                  ) : (
                    cardContent
                  )}
                </FadeIn>
              </Grid.Col>
            );
          })}
        </Grid>
      </Container>

      <Modal
        opened={modalOpen}
        onClose={closeModal}
        withCloseButton={false}
        centered
        lockScroll={false}
        transitionProps={{ transition: 'fade', duration: 200 }}
        size="auto"
        padding={0}
        zIndex={2000}
        overlayProps={{
          color: '#000000',
          backgroundOpacity: 0.35,
          blur: 5,
        }}
        styles={{
          content: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            overflow: 'visible',
          },
          body: {
            padding: 0,
          },
        }}
      >
        {activeProject && activeProject.screenshots && (
          <Box style={{ width: '90vw', maxWidth: '860px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Image */}
            <Box style={{ position: 'relative', height: '72vh', width: '100%', borderRadius: 12, overflow: 'hidden' }}>
              <Image
                src={activeProject.screenshots[slideIndex]}
                alt={`${activeProject.title} screenshot ${slideIndex + 1}`}
                fill
                style={{ objectFit: 'contain', borderRadius: 12 }}
                priority
                sizes="90vw"
              />
            </Box>

            {/* Control bar */}
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                borderRadius: 40,
                padding: '6px 10px',
                boxShadow: '0 2px 16px rgba(0,0,0,0.10), inset 0 0 0 0.5px rgba(255,255,255,0.6)',
              }}
            >
              <ActionIcon
                variant="subtle"
                radius="xl"
                size="lg"
                onClick={prev}
                disabled={activeProject.screenshots.length <= 1}
                aria-label="Previous screenshot"
                onMouseEnter={() => setHovered('prev')}
                onMouseLeave={() => setHovered(null)}
                style={{ color: 'rgba(0,0,0,0.75)', backgroundColor: hovered === 'prev' ? 'rgba(255,255,255,0.26)' : 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', transition: 'background-color 0.15s ease' }}
              >
                <IconChevronLeft size={20} />
              </ActionIcon>

              <Group gap={6}>
                {activeProject.screenshots.map((_, i) => (
                  <Box
                    key={i}
                    onClick={() => setSlideIndex(i)}
                    style={{
                      width: i === slideIndex ? 20 : 7,
                      height: 7,
                      borderRadius: 4,
                      backgroundColor: i === slideIndex ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.2)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  />
                ))}
              </Group>

              <Group gap={2}>
                <ActionIcon
                  variant="subtle"
                  radius="xl"
                  size="lg"
                  onClick={next}
                  disabled={activeProject.screenshots.length <= 1}
                  aria-label="Next screenshot"
                  onMouseEnter={() => setHovered('next')}
                  onMouseLeave={() => setHovered(null)}
                  style={{ color: 'rgba(0,0,0,0.75)', backgroundColor: hovered === 'next' ? 'rgba(255,255,255,0.26)' : 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', transition: 'background-color 0.15s ease' }}
                >
                  <IconChevronRight size={20} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  radius="xl"
                  size="lg"
                  onClick={closeModal}
                  aria-label="Close"
                  onMouseEnter={() => setHovered('close')}
                  onMouseLeave={() => setHovered(null)}
                  style={{ color: 'rgba(180,20,20,1)', backgroundColor: hovered === 'close' ? 'rgba(220,50,50,0.15)' : 'rgba(255,255,255,0.18)', transition: 'background-color 0.15s ease' }}
                >
                  <IconX size={18} />
                </ActionIcon>
              </Group>
            </Box>
          </Box>
        )}
      </Modal>
    </Box>
  );
}
