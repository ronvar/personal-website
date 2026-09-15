'use client';

import { Box, Title, Text, Timeline, Container, Badge, Group } from '@mantine/core';
import { IconCode, IconHeadset } from '@tabler/icons-react';
import { FadeIn } from './FadeIn';

const experiences = [
  {
    company: 'Handl Health',
    role: 'Technical Consultant',
    period: 'Jun 2026 – Present',
    support: true,
    highlights: [
      'Partnered with the VP of Marketing to align page layout, copy, and CCPA/GDPR compliance, while building reusable components and configuring Replit with regression tests to keep the site stable regardless of additions or changes.',
      'Configured and troubleshot analytics, tag management, and CRM integrations (GA4, Google Tag Manager, HubSpot), including GDPR/CCPA consent handling.',
      'Engineered a Replit prompt guide covering design language, layout patterns, and reusable components so non-technical staff could make site updates with consistent results without needing engineering support.',
    ],
  },
  {
    company: 'BP.fun',
    role: 'Full Stack Software Engineer',
    period: 'Jun 2025 – Feb 2026',
    highlights: [
      'Go-to technical resource company-wide: diagnosed application, account, access, and endpoint issues, including remote macOS troubleshooting through Jamf.',
      'Built onboarding and offboarding automation for account provisioning and access removal; added monitoring that caught issues before they became outages.',
      'Improved Next.js application performance by nearly 50% by isolating bottlenecks, and kept the product stable through a high-traffic launch.',
      'Co-built MCP servers to enable safe, consistent production data access during testing. With no staging environment available, the servers enforced read/write guardrails so the team could work with live data without risking corrupted state.',
    ],
  },
  {
    company: 'Mentaport',
    role: 'Full Stack Software Engineer',
    period: 'Aug 2024 - April 2025',
    highlights: [
      'Maintained applications serving 3,000+ users; investigated reported issues, gathered feedback, and shipped workflow fixes that reduced recurring support requests.',
      'Built and optimized two client dashboards (React, Next.js, Recharts). Reduced churn by 12% through faster workflows and continuous UI refinement.',
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
      'Coordinated a team of three engineers across testing, troubleshooting, deployment, and delivery.',
      'Implemented serverless workflows where replay uploads triggered AWS Lambda functions to parse content for highlights, enabling scalable processing without manual intervention.',
    ],
  },
  {
    company: 'Gif Your Game',
    role: 'Full Stack Software Engineer',
    period: 'Jul 2019 - Oct 2021',
    highlights: [
      'Worked directly with users and stakeholders to identify issues, ship fixes, and improve reliability.',
      'Built backend automation pipelines using AWS SQS and SNS with Node.js and Python, cutting repetitive operational work and improving feature performance by 15%.',
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
              bullet={
                exp.support ? (
                  <IconHeadset size={20} color="white" />
                ) : (
                  <IconCode size={20} color="white" />
                )
              }
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
