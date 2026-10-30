'use client';

import { useState, useRef } from 'react';
import { Box, Title, Text, Group, ActionIcon, Tooltip, Container } from '@mantine/core';
import { IconBrandGithub, IconBrandLinkedin } from '@tabler/icons-react';
import { useDevMode } from './DevModeContext';
import { BackgroundAnimation } from './BackgroundAnimation';
import { ContactButton } from './ContactButton';

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
      mt={{ base: 110, sm: 64 }}
      py={40}
      style={{
        minHeight: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <BackgroundAnimation devMode={devMode} />
      <Container size="md" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <Box>
          <Text
            size="sm"
            tt="uppercase"
            fw={600}
            c="blue"
            mb="md"
            style={{ letterSpacing: '0.1em' }}
          >
            Software Engineer · Technical Support & Consultant
          </Text>
        </Box>

        <Box>
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
        </Box>

        <Box>
          <Text
            size="xl"
            c="dimmed"
            maw={600}
            mx="auto"
            mt="xl"
            style={{ lineHeight: 1.6 }}
          >
            I build software and help people use it. I bring 6+ years of
            experience shipping products, troubleshooting systems, and supporting
            teams across software, hardware, accounts, and networks.
          </Text>
        </Box>

        <Box>
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
            <ContactButton />
          </Group>
        </Box>

        <Box>
          <Text size="sm" c="dimmed" mt="xl">
            Scroll down to explore
          </Text>
        </Box>
      </Container>
    </Box>
  );
}
