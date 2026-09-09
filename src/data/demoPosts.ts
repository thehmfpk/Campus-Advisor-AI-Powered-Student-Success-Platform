import type { Post, PostCategory } from '@/types/db';

/**
 * Bundled demo community posts so the feed is never empty for a fresh visitor
 * (no seeding required). These are read-only samples; real posts from the
 * database (when configured/seeded) always take precedence.
 */
interface DemoPost {
  author_name: string;
  university_name: string;
  category: PostCategory;
  content: string;
  likes_count: number;
  hoursAgo: number;
  image_url?: string;
}

const RAW: DemoPost[] = [
  {
    author_name: 'Ayesha Khan',
    university_name: 'NUST',
    category: 'opportunity',
    content:
      'Google Summer of Code applications are open. Great chance to contribute to open source and get paid for it. Start reaching out to organizations early.',
    likes_count: 42,
    hoursAgo: 2,
  },
  {
    author_name: 'Bilal Ahmed',
    university_name: 'FAST-NUCES',
    category: 'event',
    content:
      'Our university is hosting a 24-hour hackathon next month. Teams of up to 4. Prizes for the top 3. Looking for a frontend teammate who knows React.',
    likes_count: 28,
    hoursAgo: 6,
  },
  {
    author_name: 'Fatima Riaz',
    university_name: 'LUMS',
    category: 'scholarship',
    content:
      'Reminder: the HEC need-based scholarship portal is open this semester. Check eligibility and apply early. Please verify deadlines on the official HEC website.',
    likes_count: 63,
    hoursAgo: 20,
  },
  {
    author_name: 'Hamza Sheikh',
    university_name: 'COMSATS University',
    category: 'internship',
    content:
      'Systems Limited is hiring frontend interns. Solid opportunity if you know HTML, CSS, JavaScript and React. Apply through LinkedIn and tailor your CV to the role.',
    likes_count: 35,
    hoursAgo: 30,
  },
  {
    author_name: 'Sana Malik',
    university_name: 'GIKI',
    category: 'achievement',
    content:
      'Our team reached the national finals of the ICPC regional contest. Months of daily problem solving on Codeforces really paid off. Consistency beats intensity.',
    likes_count: 91,
    hoursAgo: 48,
    image_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&q=70',
  },
  {
    author_name: 'Usman Tariq',
    university_name: 'UET Lahore',
    category: 'university_problem',
    content:
      'The library needs longer hours during exam week. If enough of us request it through the student council, we can make it happen. Who is in?',
    likes_count: 17,
    hoursAgo: 72,
  },
  {
    author_name: 'Zainab Hussain',
    university_name: 'IBA Karachi',
    category: 'general',
    content:
      'Study tip that changed my grades: after every lecture, spend 10 minutes writing the key ideas from memory. Active recall is far more effective than re-reading notes.',
    likes_count: 54,
    hoursAgo: 96,
  },
  {
    author_name: 'Ali Raza',
    university_name: 'Air University',
    category: 'announcement',
    content:
      'The AI & Data Science society is starting a weekend study circle on machine learning fundamentals. Beginners welcome. Bring a laptop and curiosity.',
    likes_count: 22,
    hoursAgo: 120,
  },
];

export const DEMO_POSTS: Post[] = RAW.map((p, i) => ({
  id: `demo-${i}`,
  author_id: `demo-author-${i}`,
  author_name: p.author_name,
  author_avatar: null,
  university_id: null,
  university_name: p.university_name,
  category: p.category,
  content: p.content,
  image_url: p.image_url ?? null,
  status: 'published',
  likes_count: p.likes_count,
  comments_count: 0,
  liked_by_me: false,
  created_at: new Date(Date.now() - p.hoursAgo * 3600_000).toISOString(),
}));
