'use client';

import { useCallback } from 'react';
import { Box, Title, Text, Badge, Group, Container, SimpleGrid, Paper, useMantineColorScheme } from '@mantine/core';
import { createStyles } from '@mantine/emotion';
import { FadeIn } from './FadeIn';

const useStyles = createStyles(() => ({
  section: {
    backgroundColor: 'var(--background)',
  },
  subtitle: {
    letterSpacing: '0.1em',
  },
  grid: {
    alignItems: 'stretch',
  },
  glassCard: {
    border: '1px solid var(--gray-200)',
    backdropFilter: 'blur(16px) saturate(160%)',
    WebkitBackdropFilter: 'blur(16px) saturate(160%)',
    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.08)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  badge: {
    textTransform: 'none',
    fontWeight: 500,
  },
}));

const skillCategories = [
  {
    title: 'Frontend',
    skills: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Tailwind CSS', 'Redux', 'MantineUI', 'ChakraUI', 'Chart.js'],
  },
  {
    title: 'Backend',
    skills: ['Node.js', 'Python', 'C++', 'Express', 'FastAPI', 'REST APIs', 'PostgreSQL', 'MongoDB', 'Redis'],
  },
  {
    title: 'DevOps & Cloud',
    skills: ['AWS', 'S3', 'SQS', 'SNS', 'Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions', 'Cloudflare', 'R2', 'Firestore'],
  },
  {
    title: 'Tools & Methods',
    skills: ['Git', 'Agile/Scrum', 'Vitest', 'Playwright', 'Figma', 'Linear', 'Datadog', 'Sentry'],
  },
];

export function Skills() {
  const { classes, cx } = useStyles();
  const { colorScheme } = useMantineColorScheme();
  const cardBackgroundColor = colorScheme === 'dark' ? 'rgba(29, 29, 31, 0.72)' : 'rgba(255, 255, 255, 0.72)';

  const renderSkillCategory = useCallback((category: typeof skillCategories[0], index: number) => (
    <FadeIn key={category.title} delay={index * 100} style={{ height: '100%' }}>
      <Paper p="xl" radius="xl" className={classes.glassCard} style={{ backgroundColor: cardBackgroundColor }}>
        <Text fw={600} size="lg" mb="md">
          {category.title}
        </Text>
        <Group gap="xs">
          {category.skills.map((skill) => (
            <Badge
              key={skill}
              variant="light"
              color="blue"
              size="lg"
              radius="md"
              className={classes.badge}
            >
              {skill}
            </Badge>
          ))}
        </Group>
      </Paper>
    </FadeIn>
  ), [classes.glassCard, classes.badge, cardBackgroundColor]);

  return (
    <Box component="section" id="skills" className={classes.section}>
      <Container size="lg">
        <FadeIn>
          <Text
            size="sm"
            tt="uppercase"
            fw={600}
            c="blue"
            mb="xs"
            className={classes.subtitle}
          >
            Expertise
          </Text>
          <Title order={2} size="2.5rem" mb="xl">
            Skills & Technologies
          </Title>
        </FadeIn>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl" className={classes.grid}>
          {skillCategories.map(renderSkillCategory)}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
