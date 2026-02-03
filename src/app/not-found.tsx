'use client';

import { Box, Title, Text, Button, Container } from '@mantine/core';
import { IconTool, IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--background)',
      }}
    >
      <Container size="sm" ta="center">
        <IconTool
          size={80}
          stroke={1.5}
          style={{ color: 'var(--apple-blue)', marginBottom: '1rem' }}
        />
        <Title order={1} size="4rem" fw={700} mb="md">
          404
        </Title>
        <Title order={2} size="1.5rem" fw={500} c="dimmed" mb="lg">
          Looks like this page needs some DIY...
        </Title>
        <Text c="dimmed" mb="xl">
          But I haven&apos;t built it yet. Let&apos;s get you back to the homepage.
        </Text>
        <Button
          component={Link}
          href="/"
          size="lg"
          radius="xl"
          leftSection={<IconArrowLeft size={18} />}
          variant="light"
        >
          Back to Home
        </Button>
      </Container>
    </Box>
  );
}
