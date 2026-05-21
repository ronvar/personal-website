export interface Project {
  title: string;
  description: string;
  tags: string[];
  gradient: string;
  link?: string;
  coverUrl: string;
  hasModal?: boolean;
  screenshots?: string[];
}

export const projects: Project[] = [
  {
    title: 'BP.fun',
    description: 'Revolutionary tokenomics platform enabling unique token creation and trading mechanics on the blockchain.',
    tags: ['React', 'Solana', 'TypeScript', 'Web3'],
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
    description: 'Hardcore math puzzle game inspired by Wordle. Features daily puzzles, progress tracking via Dynamic SDK, and crypto integrations.',
    tags: ['Next.js', 'Jotai', 'Mantine', 'TypeScript'],
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #556270 100%)',
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
    description: 'Comprehensive web3 analytics dashboard providing insights into NFT collections and wallet behavior.',
    tags: ['React', 'Typescript', 'Recharts', 'Blockchain', 'SQL', 'Firestore'],
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    coverUrl: 'https://media.licdn.com/dms/image/v2/D562DAQGb0aHLG6kY1g/profile-treasury-image-shrink_800_800/profile-treasury-image-shrink_800_800/0/1716490932799?e=1770962400&v=beta&t=ewzpI_p_zujz-7fFGFQoVlrAZpIYzYGXJs7smqn9Q18',
    hasModal: true,
    screenshots: [
      "/img/bello/bello-wallets.png",
      "/img/bello/bello-heatmap.png",
      "/img/bello/bello-charts.png",
      "/img/bello/bello-avatars.png",
    ]
  },
];
