'use client';

import { Box, Title, Text, Timeline, Container, Badge, Group } from '@mantine/core';
import { IconBriefcase } from '@tabler/icons-react';
import { FadeIn } from './FadeIn';

const experiences = [
  {
    company: 'BP.fun',
    role: 'Senior Full Stack Engineer',
    period: '2024 - Present',
    description: 'Leading development of tokenomics platform with Solana blockchain integration.',
    highlights: [
      'Architected real-time trading system handling 10k+ transactions/day',
      'Implemented smart contract integrations with Anchor framework',
      'Built responsive React frontend with TypeScript and Web3 wallet connectivity',
    ],
  },
  {
    company: 'Mentaport',
    role: 'Full Stack Engineer',
    period: '2023 - 2024',
    description: 'Built enterprise content authenticity platform for digital media verification.',
    highlights: [
      'Developed cryptographic content verification APIs using Node.js and PostgreSQL',
      'Created admin dashboard with Next.js for content management',
      'Integrated AWS services for scalable media processing pipeline',
    ],
  },
  {
    company: 'Bello',
    role: 'Software Engineer',
    period: '2022 - 2023',
    description: 'Developed web3 analytics tools for NFT market insights.',
    highlights: [
      'Built GraphQL APIs for blockchain data aggregation',
      'Created visualization components for wallet analytics',
      'Optimized data pipelines reducing query times by 60%',
    ],
  },
  {
    company: 'Medal.tv',
    role: 'Software Engineer',
    period: '2020 - 2022',
    description: 'Worked on gaming clip platform serving millions of users.',
    highlights: [
      'Developed video processing features with FFmpeg integration',
      'Built React components for clip editor functionality',
      'Implemented CDN optimization reducing load times by 40%',
    ],
  },
  {
    company: 'Gif Your Game',
    role: 'Junior Developer',
    period: '2019 - 2020',
    description: 'Early career role building gaming clip capture software.',
    highlights: [
      'Contributed to desktop application development',
      'Implemented clip sharing features',
      'Learned full-stack development practices',
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
              bullet={<IconBriefcase size={20} color="white" />}
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
                  <Text fw={500} c="dimmed" size="md" mb="sm">
                    {exp.company}
                  </Text>
                </FadeIn>
              }
            >
              <FadeIn delay={index * 100 + 50}>
                <Text c="dimmed" size="sm" mb="sm">
                  {exp.description}
                </Text>
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
