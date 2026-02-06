'use client';

import { Box, Title, Text, Timeline, Container, Badge, Group } from '@mantine/core';
import { IconCode } from '@tabler/icons-react';
import { FadeIn } from './FadeIn';

const experiences = [
  {
    company: 'BP.fun',
    role: 'Full Stack Software Engineer',
    period: 'Jun 2025 – Present',
    highlights: [
      'Architected an end-to-end social identity system (usernames, profile images, banners), migrating lookups from wallet-based identifiers to SEO-friendly slugs via Firestore–PostgreSQL synchronization.',
      'Improved Next.js application performance by 50% by consolidating real-time event listeners and optimizing image rendering and delivery.',
    ],
  },
  {
    company: 'Mentaport',
    role: 'Full Stack Software Engineer',
    period: 'Aug 2024 - April 2025',
    highlights: [
      'Built and optimized two client dashboards (React, Next.js, Recharts) adopted by 3,000+ monthly users. Reduced churn by 12% through faster workflows and continuous UI/UX refinement.',
      'Developed a high-volume scraping pipeline with proxy rotation and headless automation. Enabled parallel verification of 10K+ records per day while bypassing anti-bot protections.',
    ],
  },
  {
    company: 'Bello.lol',
    role: 'Full Stack Software Engineer',
    period: 'Aug 2023 - May 2024',
    highlights: [
      'Led full stack rebuild of Bello V2 (Postgres, Next.js). Improved page load times by 25% and introduced user-personalized themes that increased retention.',
      'Engineered secure decentralized messaging services (XMTP, Farcaster) with custom encryption. Supported 10K+ encrypted messages per month and provided analytics for click-through tracking.',
    ],
  },
  {
    company: 'Medal.tv',
    role: 'Full Stack Software Engineer III',
    period: 'Oct 2021 - Dec 2022',
    highlights: [
      'Implemented serverless workflows where replay uploads triggered AWS Lambda functions to parse content for highlights, enabling scalable processing without manual intervention.',
      'Shipped Game Status Bar V1 within 2 weeks, raising in-game settings interactions by 15% and validating roadmap feasibility.',
    ],
  },
  {
    company: 'Gif Your Game',
    role: 'Full Stack Software Engineer',
    period: 'Jul 2019 - Oct 2021',
    highlights: [
      'Built backend automation pipelines using AWS SQS for job queuing and SNS for mobile app notifications, alongside Node.js and Python systems. Increased feature performance and efficiency by 15%.',
      'Managed S3 storage and deployed both Unix and Windows EC2 instances (Unix for background workers, Windows for Steam update automation).',
    ],
  },
];

export function Experience() {
  return (
    <Box
      component="section"
      id="experience"
      style={{
        backgroundColor: 'var(--background)',
      }}
    >
      <Container size="md">
        <FadeIn>
          <Text
            size="sm"
            tt="uppercase"
            fw={600}
            c="blue"
            mb="xs"
            style={{ letterSpacing: '0.1em' }}
          >
            Career
          </Text>
          <Title order={2} size="2.5rem" mb="xl">
            Experience
          </Title>
        </FadeIn>

        <Timeline
          active={experiences.length - 1}
          bulletSize={40}
          lineWidth={2}
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
              bullet={<IconCode size={20} color="white" />}
              title={
                <FadeIn delay={index * 100}>
                  <Group gap="sm" mb="xs">
                    <Text fw={600} size="lg">
                      {exp.role}
                    </Text>
                    <Badge variant="light" color="blue" size="sm">
                      {exp.period}
                    </Badge>
                  </Group>
                  <Text fw={500} c="dimmed.8" size="md" mb="sm">
                    {exp.company}
                  </Text>
                </FadeIn>
              }
            >
              <FadeIn delay={index * 100 + 50}>
                <Box component="ul" style={{ margin: 0, paddingLeft: '1.2rem' }}>
                  {exp.highlights.map((highlight, i) => (
                    <Text
                      key={i}
                      component="li"
                      size="sm"
                      c="dimmed"
                      mb={4}
                      style={{ lineHeight: 1.5 }}
                    >
                      {highlight}
                    </Text>
                  ))}
                </Box>
              </FadeIn>
            </Timeline.Item>
          ))}
        </Timeline>
      </Container>
    </Box>
  );
}
