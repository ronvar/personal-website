interface ExperienceMetric {
  value: string;
  label: string;
}

interface ExperienceHighlights {
  title: 'Engineering' | 'IT & Support' | 'Operations';
  items: string[];
}

interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  support?: boolean;
  metrics: ExperienceMetric[];
  highlights: ExperienceHighlights[];
}

// Metrics use the software resume and user-confirmed PC support scope.
export const experiences: ExperienceEntry[] = [
  {
    company: 'Handl Health',
    role: 'Technical Consultant',
    period: 'Jun 2026 - Present',
    support: true,
    metrics: [],
    highlights: [
      {
        title: 'Engineering',
        items: [
          'Led the marketing-site migration to React and Vite, preserving SEO with 301 redirects and delivering the launch on schedule.',
          'Improved performance through lazy loading and WebP/WebM asset optimization; partnered with marketing and design on reusable components and regression tests.',
        ],
      },
      {
        title: 'IT & Support',
        items: [
          'Configured and troubleshot GA4, Google Tag Manager, and HubSpot integrations, including attribution and GDPR/CCPA consent handling.',
          'Created a Replit guide for layout, design, and reusable components so non-technical staff could update the site independently.',
        ],
      },
    ],
  },
  {
    company: 'BP.fun',
    role: 'Full Stack Software Engineer',
    period: 'Jun 2025 - Feb 2026',
    metrics: [
      { value: '>40%', label: 'Frontend performance gain' },
    ],
    highlights: [
      {
        title: 'Engineering',
        items: [
          'Improved frontend performance by more than 40% by refactoring real-time listeners, reducing redundant state updates, and improving image rendering and delivery.',
          'Built a social identity platform with Next.js, Firestore, and PostgreSQL, including authentication, sessions, delegated permissions, and SEO-friendly profiles.',
        ],
      },
      {
        title: 'IT & Support',
        items: [
          'Served as the company-wide technical resource for application, account, access, and endpoint issues, including remote macOS troubleshooting through Jamf.',
          'Automated account provisioning and access removal for onboarding and offboarding; added monitoring to catch issues before outages.',
        ],
      },
    ],
  },
  {
    company: 'Mentaport',
    role: 'Full Stack Software Engineer',
    period: 'Aug 2024 - Apr 2025',
    metrics: [
      { value: '12%', label: 'Higher retention' },
      { value: '3,000+', label: 'Monthly users' },
    ],
    highlights: [
      {
        title: 'Engineering',
        items: [
          'Developed React, Next.js, TypeScript, and Recharts analytics dashboards for 3,000+ monthly users; improved retention by 12% through better workflows, state management, and chart rendering.',
        ],
      },
      {
        title: 'IT & Support',
        items: [
          'Investigated user-reported application issues, gathered feedback, and shipped workflow fixes that reduced recurring support requests.',
        ],
      },
    ],
  },
  {
    company: 'Bello.lol',
    role: 'Full Stack Software Engineer',
    period: 'Aug 2023 - May 2024',
    metrics: [
      { value: '20%', label: 'Higher retention' },
      { value: '25%', label: 'Page-load performance gain' },
      { value: '10K+', label: 'Encrypted messages / month' },
    ],
    highlights: [
      {
        title: 'Engineering',
        items: [
          'Led the Next.js and PostgreSQL rebuild of Bello V2, improving page-load performance by 25% and retention by 20% through personalization and reusable UI patterns.',
          'Built XMTP and Farcaster messaging workflows with encrypted payload processing, delivery analytics, and click-through tracking, supporting 10,000+ encrypted messages per month.',
        ],
      },
    ],
  },
  {
    company: 'Medal.tv',
    role: 'Full Stack Software Engineer III',
    period: 'Oct 2021 - Dec 2022',
    metrics: [
      { value: '15%', label: 'More settings interactions' },
      { value: '2 weeks', label: 'Game Status Bar V1 delivery' },
    ],
    highlights: [
      {
        title: 'Engineering',
        items: [
          'Delivered Game Status Bar V1 in two weeks, increasing in-game settings interactions by 15% through frontend development, QA, and release iteration.',
          'Built AWS serverless pipelines that triggered Lambda-based replay parsing on upload, enabling highlight processing without manual operations.',
        ],
      },
      {
        title: 'Operations',
        items: [
          'Coordinated three engineers across testing, troubleshooting, deployment, and delivery.',
        ],
      },
    ],
  },
  {
    company: 'Gif Your Game',
    role: 'Full Stack Software Engineer',
    period: 'Jul 2019 - Oct 2021',
    metrics: [
      { value: '30-40', label: 'PCs supported' },
      { value: '15%', label: 'Higher system efficiency' },
    ],
    highlights: [
      {
        title: 'Engineering',
        items: [
          'Improved system efficiency by 15% with Node.js and Python automation using AWS SQS, SNS, S3, and EC2 for asynchronous jobs, notifications, queue-based retries, and Steam deployments.',
        ],
      },
      {
        title: 'IT & Support',
        items: [
          'Supported approximately 30-40 PCs and worked directly with users and stakeholders to diagnose issues, ship fixes, and improve application reliability.',
        ],
      },
    ],
  },
];
