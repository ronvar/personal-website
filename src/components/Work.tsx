'use client';

import { Box, Title, Text, Card, Container, SimpleGrid, Badge, Group } from '@mantine/core';
import Image from 'next/image';
import { IconExternalLink } from '@tabler/icons-react';
import { FadeIn } from './FadeIn';

const projects = [
  {
    title: 'BP.fun',
    description: 'Revolutionary tokenomics platform enabling unique token creation and trading mechanics on the blockchain.',
    tags: ['React', 'Solana', 'TypeScript', 'Web3'],
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    link: 'https://bp.fun',
    coverUrl: '/img/mathler-example.png'
  },
  {
    title: 'Mentaport',
    description: 'Enterprise-grade content authenticity platform leveraging cryptographic verification for digital media.',
    tags: ['Next.js', 'Node.js', 'PostgreSQL', 'AWS'],
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    coverUrl: 'https://picsum.photos/1920/1080'
  },
  {
    title: 'Bello',
    description: 'Comprehensive web3 analytics dashboard providing insights into NFT collections and wallet behavior.',
    tags: ['React', 'Python', 'Ethereum'],
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    coverUrl: 'https://picsum.photos/1920/1080'
  },
  {
    title: 'Medal.tv',
    description: 'Gaming clip platform enabling millions of gamers to capture, edit, and share their gameplay moments.',
    tags: ['React', 'Node.js', 'FFmpeg', 'CDN'],
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    link: 'https://medal.tv',
    coverUrl: 'https://picsum.photos/1920/1080'
  },
];

export function Work() {
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

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
          {projects.map((project, index) => {
            const cardContent = (
              <Card
                padding={0}
                radius="lg"
                style={{
                  overflow: 'hidden',
                  border: '1px solid var(--gray-200)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: project.link ? 'pointer' : 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Box
                  style={{
                    background: project.coverUrl ? 'transparent' : project.gradient,
                    height: 160,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
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
                <Box p="lg" style={{ backgroundColor: 'var(--background)' }}>
                  <Group justify="space-between" mb="xs">
                    <Text fw={600} size="lg">
                      {project.title}
                    </Text>
                    {project.link && <IconExternalLink size={18} style={{ color: 'var(--gray-400)' }} />}
                  </Group>
                  <Text size="sm" c="dimmed" mb="md" style={{ lineHeight: 1.6 }}>
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
              <FadeIn key={project.title} delay={index * 100}>
                {project.link ? (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    {cardContent}
                  </a>
                ) : (
                  cardContent
                )}
              </FadeIn>
            );
          })}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
