'use client';

import { useState } from 'react';
import { Box, Title, Text, Card, Container, Grid, Badge, Group, Modal, ActionIcon } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import Image from 'next/image';
import { IconExternalLink, IconX } from '@tabler/icons-react';
import { FadeIn } from './FadeIn';
import { projects, Project } from '../data/projects';
import '@mantine/carousel/styles.css';

export function Work() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const handleProjectClick = (project: Project) => {
    if (project.hasModal && project.screenshots && project.screenshots.length > 0) {
      setActiveProject(project);
      setModalOpen(true);
    }
  };

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
        onClose={() => setModalOpen(false)}
        withCloseButton={false}
        centered
        size="auto"
        padding={0}
        zIndex={2000}
        overlayProps={{
          backgroundOpacity: 0.5,
          blur: 3,
          color: 'white',
        }}
        styles={{
          content: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            overflow: 'visible',
          },
          body: {
            padding: 0,
          }
        }}
      >
        {activeProject && activeProject.screenshots && (
          <Box style={{ position: 'relative', width: '90vw', maxWidth: '800px' }}>
            <ActionIcon
              variant="filled"
              color="gray"
              radius="xl"
              size="lg"
              onClick={() => setModalOpen(false)}
              style={{
                position: 'absolute',
                top: -20,
                right: 0,
                zIndex: 100,
                opacity: 0.8,
                transition: "all 0.15s ease-in-out"
              }}
            >
              <IconX size={20} />
            </ActionIcon>

            <Carousel
              withIndicators
              emblaOptions={{ loop: true }}
              styles={{
                control: {
                  backgroundColor: 'white',
                  color: 'black',
                  opacity: 0.7,
                  border: 'none',
                  '&:hover': {
                    opacity: 1
                  }
                },
                indicator: {
                  backgroundColor: 'white',
                  opacity: 0.5,
                  '&[data-active]': {
                    opacity: 1
                  }
                },
                slide: {
                  borderRadius: '10px',
                  overflow: 'hidden',
                }
              }}
            >
              {activeProject.screenshots.map((url, i) => (
                <Carousel.Slide key={i}>
                  {/* Fixed height container for lightbox feel, image contains itself */}
                  <Box style={{ position: 'relative', height: '80vh', width: '100%', borderRadius: '10px', overflow: 'hidden' }}>
                    <Image
                      src={url}
                      alt={`${activeProject.title} Screenshot ${i + 1}`}
                      fill
                      style={{ objectFit: 'contain' }}
                      priority={i === 0}
                      sizes="90vw"
                    />
                  </Box>
                </Carousel.Slide>
              ))}
            </Carousel>
          </Box>
        )}
      </Modal>
    </Box>
  );
}
