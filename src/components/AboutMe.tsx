"use client";

import {
  Box,
  Title,
  Text,
  Container,
  Paper,
  Badge,
  Group,
  SimpleGrid,
  Stack,
  useMantineColorScheme,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { createStyles } from "@mantine/emotion";
import {
  IconCode,
  IconHeadset,
  IconHammer,
  IconCar,
  IconServer,
} from "@tabler/icons-react";
import { FadeIn } from "./FadeIn";

const useStyles = createStyles((theme) => ({
  section: {
    background:
      "linear-gradient(180deg, var(--background) 0%, var(--gray-100) 100%)",
  },
  subtitle: {
    letterSpacing: "0.1em",
  },
  glassCard: {
    border: "1px solid var(--gray-200)",
    backdropFilter: "blur(16px) saturate(160%)",
    WebkitBackdropFilter: "blur(16px) saturate(160%)",
    boxShadow: "0 24px 48px rgba(0, 0, 0, 0.08)",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  pill: {
    textTransform: "none",
    fontWeight: 500,
  },
}));

export function AboutMe() {
  const { classes } = useStyles();
  const { colorScheme } = useMantineColorScheme();
  const cardBackgroundColor =
    colorScheme === "dark"
      ? "rgba(29, 29, 31, 0.72)"
      : "rgba(255, 255, 255, 0.72)";

  return (
    <Box component="section" id="about-me" className={classes.section}>
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
            Profile
          </Text>
          <Title order={2} size="2.5rem" mb="xl">
            About Me
          </Title>
        </FadeIn>

        <Stack gap="xl">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            <FadeIn delay={100}>
              <Paper
                radius="xl"
                p="xl"
                className={classes.glassCard}
                style={{ backgroundColor: cardBackgroundColor }}
              >
                <Group align="flex-start" wrap="nowrap" mb="md">
                  <ThemeIcon size={48} radius="md" variant="light" color="blue">
                    <IconCode
                      style={{ width: rem(28), height: rem(28) }}
                      stroke={1.5}
                    />
                  </ThemeIcon>
                  <div>
                    <Title order={3} size="h3" mb="xs">
                      Engineering
                    </Title>
                    <Text c="dimmed" style={{ lineHeight: 1.7 }}>
                      I strive for{" "}
                      <Text span c="blue" fw={600}>
                        simple but effective
                      </Text>{" "}
                      user experiences,{" "}
                      <Text span c="blue" fw={600}>
                        clear code
                      </Text>
                      {", "}
                      and{" "}
                      <Text span c="blue" fw={600}>
                        performance
                      </Text>{" "}
                      across the stack. The best software feels effortless and
                      sits on straightforward, readable logic.
                    </Text>
                  </div>
                </Group>
                <Group gap="xs" mt="sm">
                  <Badge
                    variant="light"
                    color="blue"
                    size="lg"
                    radius="xl"
                    className={classes.pill}
                  >
                    User-Centric
                  </Badge>
                  <Badge
                    variant="light"
                    color="blue"
                    size="lg"
                    radius="xl"
                    className={classes.pill}
                  >
                    Clean Architecture
                  </Badge>
                  <Badge
                    variant="light"
                    color="blue"
                    size="lg"
                    radius="xl"
                    className={classes.pill}
                  >
                    Performance
                  </Badge>
                  <Badge
                    variant="light"
                    color="blue"
                    size="lg"
                    radius="xl"
                    className={classes.pill}
                  >
                    Maintainability
                  </Badge>
                </Group>
              </Paper>
            </FadeIn>

            <FadeIn delay={180}>
              <Paper
                radius="xl"
                p="xl"
                className={classes.glassCard}
                style={{ backgroundColor: cardBackgroundColor }}
              >
                <Group align="flex-start" wrap="nowrap" mb="md">
                  <ThemeIcon size={48} radius="md" variant="light" color="teal">
                    <IconHeadset
                      style={{ width: rem(28), height: rem(28) }}
                      stroke={1.5}
                    />
                  </ThemeIcon>
                  <div>
                    <Title order={3} size="h3" mb="xs">
                      Technical Support
                    </Title>
                    <Text c="dimmed" style={{ lineHeight: 1.7 }}>
                      I am often the{" "}
                      <Text span c="teal" fw={600}>
                        first call
                      </Text>{" "}
                      when something technical fails: apps, accounts, endpoints,
                      or networks. I diagnose under time pressure, write docs
                      people can follow, and train non-technical colleagues so
                      they can keep going without me.
                    </Text>
                  </div>
                </Group>
                <Group gap="xs" mt="sm">
                  <Badge
                    variant="light"
                    color="teal"
                    size="lg"
                    radius="xl"
                    className={classes.pill}
                  >
                    End-User Support
                  </Badge>
                  <Badge
                    variant="light"
                    color="teal"
                    size="lg"
                    radius="xl"
                    className={classes.pill}
                  >
                    Documentation
                  </Badge>
                  <Badge
                    variant="light"
                    color="teal"
                    size="lg"
                    radius="xl"
                    className={classes.pill}
                  >
                    Training
                  </Badge>
                  <Badge
                    variant="light"
                    color="teal"
                    size="lg"
                    radius="xl"
                    className={classes.pill}
                  >
                    Systems & AV
                  </Badge>
                </Group>
              </Paper>
            </FadeIn>
          </SimpleGrid>

          <Box>
            <FadeIn delay={200}>
              <Title order={3} size="h3" mb="lg" mt="md">
                Life Offline & DIY
              </Title>
            </FadeIn>

            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
              {/* DIY / Home Projects */}
              <FadeIn delay={300}>
                <Paper
                  radius="xl"
                  p="lg"
                  className={classes.glassCard}
                  style={{ backgroundColor: cardBackgroundColor }}
                >
                  <ThemeIcon
                    size={40}
                    radius="xl"
                    variant="light"
                    color="teal"
                    mb="md"
                  >
                    <IconHammer
                      style={{ width: rem(22), height: rem(22) }}
                      stroke={1.5}
                    />
                  </ThemeIcon>
                  <Text fw={600} size="lg" mb="xs">
                    DIY-er
                  </Text>
                  <Text c="dimmed" size="sm" style={{ lineHeight: 1.6 }}>
                    I love getting my hands dirty with home renovation. From
                    routing new ethernet cables through multiple rooms and
                    replacing windows, to upgrading bathrooms and kitchen
                    cabinets.
                  </Text>
                </Paper>
              </FadeIn>

              {/* Automotive */}
              <FadeIn delay={400}>
                <Paper
                  radius="xl"
                  p="lg"
                  className={classes.glassCard}
                  style={{ backgroundColor: cardBackgroundColor }}
                >
                  <ThemeIcon
                    size={40}
                    radius="xl"
                    variant="light"
                    color="red"
                    mb="md"
                  >
                    <IconCar
                      style={{ width: rem(22), height: rem(22) }}
                      stroke={1.5}
                    />
                  </ThemeIcon>
                  <Text fw={600} size="lg" mb="xs">
                    One Man Auto Shop
                  </Text>
                  <Text c="dimmed" size="sm" style={{ lineHeight: 1.6 }}>
                    An enthusiast for working on cars. I enjoy the mechanical
                    complexity (and cost savings) of fixing and maintaining
                    vehicles myself.
                  </Text>
                </Paper>
              </FadeIn>

              {/* Home Lab */}
              <FadeIn delay={500}>
                <Paper
                  radius="xl"
                  p="lg"
                  className={classes.glassCard}
                  style={{ backgroundColor: cardBackgroundColor }}
                >
                  <ThemeIcon
                    size={40}
                    radius="xl"
                    variant="light"
                    color="indigo"
                    mb="md"
                  >
                    <IconServer
                      style={{ width: rem(22), height: rem(22) }}
                      stroke={1.5}
                    />
                  </ThemeIcon>
                  <Text fw={600} size="lg" mb="xs">
                    Home Lab & AV
                  </Text>
                  <Text c="dimmed" size="sm" style={{ lineHeight: 1.6 }}>
                    Home server, structured Ethernet, routing and wireless,
                    plus a nine-channel theater I designed and calibrated.
                    I also assemble and repair PCs and chase down display,
                    projector, and connectivity faults.
                  </Text>
                </Paper>
              </FadeIn>
            </SimpleGrid>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
