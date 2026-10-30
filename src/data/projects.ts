export interface Project {
  title: string;
  role?: string;
  // Measured result shown under the title; leave out when there isn't one.
  outcome?: string;
  description: string;
  tags: string[];
  link?: string;
  coverUrl: string;
  hasModal?: boolean;
  screenshots?: string[];
  // Supporting projects get a smaller row.
  compact?: boolean;
}

export const projects: Project[] = [
  {
    title: 'Handl Health',
    role: 'Technical consultant',
    outcome: 'On-schedule migration, plus ~200 data-driven rate pages',
    description: 'Migrated a healthcare marketing site to React and Vite. Connected analytics, consent-aware CRM forms, and tools the team can maintain.',
    tags: ['React', 'Vite', 'GA4', 'HubSpot', 'GDPR/CCPA'],
    coverUrl: '/img/handlhealth/homepage.png',
    hasModal: true,
    screenshots: [
      '/img/handlhealth/homepage.png',
      '/img/handlhealth/tabs.png',
      '/img/handlhealth/hubspot-form.png',
      '/img/handlhealth/mobile.png',
    ],
  },
  {
    title: 'BP.fun',
    role: 'Full stack engineer',
    outcome: '>40% frontend performance gain',
    description: 'Improved a Solana platform’s real-time frontend and built its social identity layer, from authentication to profiles and delegated permissions.',
    tags: ['React', 'Solana', 'TypeScript', 'Web3'],
    coverUrl: '/img/bp.fun/trade.png',
    screenshots: [
      "/img/bp.fun/homepage.png",
      "/img/bp.fun/trade.png",
      "/img/bp.fun/profile.png",
    ],
    hasModal: true,
  },
  {
    title: 'Dynamic Mathler',
    description: 'A daily math puzzle in the spirit of Wordle, with progress saved through the Dynamic SDK.',
    tags: ['Next.js', 'Jotai', 'Mantine', 'TypeScript'],
    compact: true,
    coverUrl: "/img/mathler/intro.png",
    hasModal: true,
    screenshots: [
      "/img/mathler/intro.png",
      "/img/mathler/login.png",
      "/img/mathler/puzzle.png",
    ]
  },
  {
    title: 'Bello',
    role: 'Full stack engineer',
    outcome: '20% higher retention / 25% page-load performance gain',
    description: 'Rebuilt the analytics platform with Next.js and PostgreSQL, with personalized workflows and encrypted messaging.',
    tags: ['React', 'TypeScript', 'Recharts', 'Blockchain', 'SQL', 'Firestore'],
    compact: true,
    coverUrl: '/img/bello/bello-wallets.png',
    hasModal: true,
    screenshots: [
      "/img/bello/bello-wallets.png",
      "/img/bello/bello-heatmap.png",
      "/img/bello/bello-charts.png",
      "/img/bello/bello-avatars.png",
    ]
  },
];
