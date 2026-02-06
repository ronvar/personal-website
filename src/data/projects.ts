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
      'https://media.licdn.com/dms/image/v2/D562DAQGb0aHLG6kY1g/profile-treasury-image-shrink_800_800/profile-treasury-image-shrink_800_800/0/1716490932799?e=1770962400&v=beta&t=ewzpI_p_zujz-7fFGFQoVlrAZpIYzYGXJs7smqn9Q18',
      'https://media.licdn.com/dms/image/v2/D562DAQHJqtss1lgVSg/profile-treasury-image-shrink_800_800/profile-treasury-image-shrink_800_800/0/1716490959112?e=1770962400&v=beta&t=0-KwhlKsrvpauh2orVS1sYElC0wdXvgZk2WMxpBpMoc',
      'https://media.licdn.com/dms/image/v2/D562DAQGJRrBCFd6_ow/profile-treasury-image-shrink_800_800/profile-treasury-image-shrink_800_800/0/1716490916231?e=1770962400&v=beta&t=h2sDi6CDuw-lIOXAMZqGj7u7zhF3eEmFkjfmkLjDl1M',
      'https://media.licdn.com/dms/image/v2/D562DAQHrZeH5t0l3zw/profile-treasury-image-shrink_800_800/profile-treasury-image-shrink_800_800/0/1716490836300?e=1770962400&v=beta&t=-S0V1i-oFT7oy44w1DVxeL-6Ce9HkTpBLSWxHziG2Ks',
    ]
  },
];
