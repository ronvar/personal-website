'use client';

import { Box, Title, Text, Timeline, Container, Badge, Group, Paper, SimpleGrid, Stack } from '@mantine/core';
import { createStyles } from '@mantine/emotion';
import { IconCode, IconHeadset } from '@tabler/icons-react';
import { FadeIn } from './FadeIn';
import { experiences } from '@/data/experiences';

const useStyles = createStyles(() => ({
  section: {
    backgroundColor: 'var(--background)',
  },
  eyebrow: {
    letterSpacing: '0.1em',
  },
  metrics: {
    backgroundColor: 'var(--gray-100)',
    border: '1px solid var(--gray-200)',
  },
  metric: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    minWidth: 0,
  },
  metricValue: {
    order: -1,
    color: 'var(--foreground)',
    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
    fontWeight: 600,
    letterSpacing: '-0.04em',
    lineHeight: 1.2,
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
  },
  highlights: {
    margin: 0,
    paddingLeft: '1.2rem',
  },
}));

export function Experience() {
  const { classes } = useStyles();

  return (
    <Box
      component="section"
      id="experience"
      aria-labelledby="experience-title"
      className={classes.section}
    >
      <Container size="md">
        <FadeIn>
          <Text
            size="sm"
            tt="uppercase"
            fw={600}
            c="blue"
            mb="xs"
            className={classes.eyebrow}
          >
            Career
          </Text>
          <Title order={2} id="experience-title" size="2.5rem" mb="sm">
            Experience
          </Title>
          <Text c="dimmed" mb="xl" maw={560} style={{ lineHeight: 1.7 }}>
            Building products, supporting the people who use them, and keeping
            the systems behind them running.
          </Text>
        </FadeIn>

        <Timeline
          active={experiences.length - 1}
          bulletSize={40}
          lineWidth={2}
          color="blue"
          styles={{
            itemBullet: {
              backgroundColor: 'var(--apple-blue)',
              border: 'none',
            },
          }}
        >
          {experiences.map((exp, index) => (
            <Timeline.Item
              key={exp.company}
              bullet={
                exp.support ? (
                  <IconHeadset size={20} color="white" aria-hidden="true" />
                ) : (
                  <IconCode size={20} color="white" aria-hidden="true" />
                )
              }
              title={
                <FadeIn delay={index * 100}>
                  <Group gap="sm" mb="xs">
                    <Title order={3} size="lg" fw={600}>
                      {exp.company}
                    </Title>
                    <Badge variant="light" color="blue" size="sm">
                      {exp.period}
                    </Badge>
                  </Group>
                  <Text fw={500} c="dimmed" size="sm" mb="md">
                    {exp.role}
                  </Text>
                </FadeIn>
              }
            >
              <FadeIn delay={index * 100 + 50}>
                {exp.metrics.length > 0 && (
                  <Paper p={{ base: 'md', sm: 'lg' }} radius="lg" mb="lg" className={classes.metrics}>
                    <SimpleGrid
                      component="dl"
                      aria-label={`${exp.company} results`}
                      type="container"
                      cols={{ base: 1, '200px': Math.min(2, exp.metrics.length), '500px': exp.metrics.length }}
                      spacing="md"
                      m={0}
                    >
                      {exp.metrics.map((metric) => (
                        <Box key={metric.label} className={classes.metric}>
                          <Text component="dt" size="xs" c="dimmed" style={{ lineHeight: 1.5 }}>
                            {metric.label}
                          </Text>
                          <Text component="dd" m={0} className={classes.metricValue}>
                            {metric.value}
                          </Text>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Paper>
                )}

                <Stack gap="md">
                  {exp.highlights.map((group) => (
                    <Box key={group.title}>
                      <Title order={4} size="xs" fw={600} mb="xs" c="var(--foreground)">
                        {group.title}
                      </Title>
                      <Box component="ul" className={classes.highlights}>
                        {group.items.map((highlight) => (
                          <Text
                            key={highlight}
                            component="li"
                            size="sm"
                            c="dimmed"
                            mb="xs"
                            style={{ lineHeight: 1.7 }}
                          >
                            {highlight}
                          </Text>
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </FadeIn>
            </Timeline.Item>
          ))}
        </Timeline>
      </Container>
    </Box>
  );
}
