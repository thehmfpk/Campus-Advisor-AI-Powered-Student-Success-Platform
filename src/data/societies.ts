/** Seed student societies / campus clubs (Batch 6). Free, well-known programs. */
export interface SeedSociety {
  name: string;
  slug: string;
  category: string;
  description: string;
  color: string;
  website: string;
}

export const SEED_SOCIETIES: SeedSociety[] = [
  {
    name: 'Google Developer Groups on Campus (GDGoC)',
    slug: 'gdgoc',
    category: 'Tech',
    description:
      'A community for students to learn Google technologies (Android, Web, Cloud, AI) through workshops, study jams, and hackathons.',
    color: '#4285F4',
    website: 'https://gdg.community.dev/',
  },
  {
    name: 'AWS Cloud Club',
    slug: 'aws-cloud-club',
    category: 'Cloud',
    description:
      'Learn cloud computing with AWS — hands-on labs, certifications, and building real projects on the cloud.',
    color: '#FF9900',
    website: 'https://aws.amazon.com/developer/community/cloudclubs/',
  },
  {
    name: 'GitHub Campus Community',
    slug: 'github-campus',
    category: 'Open Source',
    description:
      'For students who love open source and version control. Contribute to projects, learn Git, and build a public portfolio.',
    color: '#24292E',
    website: 'https://education.github.com/',
  },
  {
    name: 'Microsoft Learn Student Ambassadors',
    slug: 'microsoft-learn',
    category: 'Tech',
    description:
      'Grow technical and leadership skills with Microsoft technologies, Azure, and community events.',
    color: '#5E5CE6',
    website: 'https://mvp.microsoft.com/studentambassadors',
  },
  {
    name: 'IEEE Student Branch',
    slug: 'ieee',
    category: 'Engineering',
    description:
      'The world\u2019s largest technical professional organization — electronics, robotics, research, and networking for engineers.',
    color: '#00629B',
    website: 'https://www.ieee.org/membership/students/',
  },
  {
    name: 'ACM Student Chapter',
    slug: 'acm',
    category: 'Computer Science',
    description:
      'The Association for Computing Machinery — competitive programming, CS talks, and research culture.',
    color: '#0085CA',
    website: 'https://www.acm.org/chapters/students',
  },
  {
    name: 'Mozilla Campus Club',
    slug: 'mozilla',
    category: 'Open Web',
    description:
      'Champion a free and open internet — web standards, privacy, and open-source contribution.',
    color: '#FF4F5E',
    website: 'https://www.mozilla.org/',
  },
  {
    name: 'Women in Tech',
    slug: 'women-in-tech',
    category: 'Community',
    description:
      'A supportive community empowering women in technology through mentorship, workshops, and networking.',
    color: '#D6336C',
    website: 'https://www.womenintech.co/',
  },
  {
    name: 'Competitive Programming Club',
    slug: 'cp-club',
    category: 'Computer Science',
    description:
      'Sharpen your problem-solving with regular contests, LeetCode/Codeforces practice, and ICPC preparation.',
    color: '#16A34A',
    website: 'https://codeforces.com/',
  },
  {
    name: 'AI & Data Science Society',
    slug: 'ai-ds',
    category: 'AI/ML',
    description:
      'Explore machine learning, data science, and AI through projects, paper reading, and Kaggle competitions.',
    color: '#7C3AED',
    website: 'https://www.kaggle.com/',
  },
];
