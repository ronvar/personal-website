'use client';

import { useState, useRef } from 'react';
import { Box, Title, Text, Group, ActionIcon, Tooltip, Container, Switch } from '@mantine/core';
import { IconBrandGithub, IconBrandLinkedin, IconMail } from '@tabler/icons-react';
import { FadeIn } from './FadeIn';
import { useDevMode } from './DevModeContext';
import { BackgroundAnimation } from './BackgroundAnimation';

export function Hero() {
  const [, setClickCount] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { devMode } = useDevMode();

  const handleNameClick = () => {
    setClickCount((prev) => {
      const newCount = prev + 1;

      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }

      if (newCount >= 3) {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 3000);
        return 0;
      }

      clickTimeoutRef.current = setTimeout(() => {
        setClickCount(0);
      }, 500);

      return newCount;
    });
  };

  return (
    <Box
      component="section"
      id="about"
      className="gradient-bg"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <BackgroundAnimation devMode={devMode} />
      <Container size="md" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <Group justify="flex-end" mb="xl">
        </Group>
        <FadeIn>
          <Text
            size="sm"
            tt="uppercase"
            fw={600}
            c="blue"
            mb="md"
            style={{ letterSpacing: '0.1em' }}
          >
            Full Stack Software Engineer
          </Text>
        </FadeIn>

        <FadeIn delay={100}>
          <Tooltip
            label="Nice, you found one of my easter eggs!"
            opened={showTooltip}
            position="bottom"
            withArrow
            transitionProps={{ transition: 'pop', duration: 200 }}
          >
            <Title
              order={1}
              size="4rem"
              fw={700}
              style={{
                cursor: 'default',
                userSelect: 'none',
                lineHeight: 1.1,
              }}
              onClick={handleNameClick}
            >
              Ronald Vargas
            </Title>
          </Tooltip>
        </FadeIn>

        <FadeIn delay={200}>
          <Text
            size="xl"
            c="dimmed"
            maw={600}
            mx="auto"
            mt="xl"
            style={{ lineHeight: 1.6 }}
          >
            I build exceptional digital experiences with modern technologies.
            Passionate about creating scalable, performant, and user-friendly
            applications that make a difference.
          </Text>
        </FadeIn>

        <FadeIn delay={300}>
          <Group justify="center" mt="xl" gap="md">
            <ActionIcon
              component="a"
              href="https://github.com/ronvar"
              target="_blank"
              rel="noopener noreferrer"
              variant="subtle"
              size="xl"
              radius="xl"
              aria-label="GitHub"
            >
              <IconBrandGithub size={24} />
            </ActionIcon>
            <ActionIcon
              component="a"
              href="https://linkedin.com/in/rvar"
              target="_blank"
              rel="noopener noreferrer"
              variant="subtle"
              size="xl"
              radius="xl"
              aria-label="LinkedIn"
            >
              <IconBrandLinkedin size={24} />
            </ActionIcon>
            <ActionIcon
              component="a"
              href="mailto:ron.var@icloud.com"
              variant="subtle"
              size="xl"
              radius="xl"
              aria-label="Email"
            >
              <IconMail size={24} />
            </ActionIcon>
          </Group>
        </FadeIn>

        <FadeIn delay={400}>
          <Text size="sm" c="dimmed" mt="xl">
            Scroll down to explore
          </Text>
        </FadeIn>
      </Container>
    </Box>
  );
}
