/**
 * Seed script — populates a Supabase Free project with demo-ready data.
 * Run with:  npm run seed
 *
 * Requires env: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAILS.
 * Uses the service-role key (server-side only) to bypass RLS for seeding.
 * Idempotent where practical (upserts + existence checks).
 */
import { createClient } from '@supabase/supabase-js';
import { SEED_UNIVERSITIES, COMMON_DEPARTMENTS } from '../src/data/universities';
import { SEED_RANKINGS } from '../src/data/rankings';
import { SEED_JOBS } from '../src/data/jobs';
import { SEED_NOTES } from '../src/data/codingNotes';
import { SEED_SOCIETIES } from '../src/data/societies';

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmails = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

if (!url || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. See .env.example.');
  process.exit(1);
}

const db = createClient(url, serviceKey, { auth: { persistSession: false } });

async function seedUniversities() {
  console.log('→ Seeding universities & departments…');
  for (const u of SEED_UNIVERSITIES) {
    const { data: existing } = await db
      .from('universities')
      .select('id')
      .eq('name', u.name)
      .maybeSingle();
    let universityId = existing?.id;
    if (!universityId) {
      const { data } = await db.from('universities').insert(u).select('id').single();
      universityId = data?.id;
    }
    if (universityId) {
      for (const name of COMMON_DEPARTMENTS) {
        const { data: dep } = await db
          .from('departments')
          .select('id')
          .eq('university_id', universityId)
          .eq('name', name)
          .maybeSingle();
        if (!dep) await db.from('departments').insert({ university_id: universityId, name });
      }
    }
  }
}

async function seedRankings() {
  console.log('→ Seeding ranking records…');
  const { count } = await db.from('ranking_records').select('*', { count: 'exact', head: true });
  // Reseed if empty or if the table only has an older/smaller dataset (< 50 rows).
  if ((count ?? 0) < 50) {
    await db.from('ranking_records').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await db.from('ranking_records').insert(SEED_RANKINGS);
  }
}

async function seedJobs() {
  console.log('→ Seeding jobs…');
  const { count } = await db.from('jobs').select('*', { count: 'exact', head: true });
  if ((count ?? 0) === 0) {
    // Strip client-only fields not present as DB columns.
    const rows = SEED_JOBS.map(({ google_url: _g, closes_date: _c, ...rest }) => rest);
    await db.from('jobs').insert(rows);
  }
}

async function seedNotes() {
  console.log('→ Seeding coding notes…');
  for (const note of SEED_NOTES) {
    await db.from('coding_notes').upsert(note, { onConflict: 'slug' });
  }
}

async function seedSocieties() {
  console.log('→ Seeding societies…');
  for (const s of SEED_SOCIETIES) {
    await db.from('societies').upsert(s, { onConflict: 'slug' });
  }
}

/** Create (or find) an auth user, mirror into users, return the auth id. */
async function ensureUser(email: string, password: string, role: 'student' | 'admin') {
  const { data: created, error } = await db.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role },
  });
  let userId = created?.user?.id;
  if (error && !userId) {
    // Likely already exists — look it up.
    const { data: list } = await db.auth.admin.listUsers();
    userId = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())?.id;
  }
  if (!userId) throw new Error(`Could not create/find user ${email}`);
  await db.from('users').upsert({ id: userId, email, role }, { onConflict: 'id' });
  return userId;
}

async function seedDemoStudent() {
  console.log('→ Seeding demo student…');
  const email = 'demo.student@campus-advisor.dev';
  const userId = await ensureUser(email, 'DemoPass123', 'student');
  const { data: univ } = await db
    .from('universities')
    .select('id')
    .eq('name', 'FAST-NUCES')
    .maybeSingle();

  const { data: profile } = await db
    .from('student_profiles')
    .upsert(
      {
        user_id: userId,
        full_name: 'Faizan Ahmed',
        roll_number: 'BSCS-F21-123',
        university_id: univ?.id ?? null,
        university_name: 'FAST-NUCES',
        department_name: 'Computer Science',
        semester: 5,
        skills: ['JavaScript', 'React', 'Python', 'SQL', 'Git'],
        career_interests: ['Frontend', 'Full-stack', 'AI/ML'],
        bio: 'CS student passionate about web development and AI. Looking for internships.',
      },
      { onConflict: 'user_id' },
    )
    .select('id')
    .single();

  if (profile?.id) {
    const { count } = await db
      .from('student_subjects')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profile.id);
    if ((count ?? 0) === 0) {
      await db.from('student_subjects').insert([
        { profile_id: profile.id, subject_name: 'Data Structures', credit_hours: 3, grade: 'A' },
        { profile_id: profile.id, subject_name: 'Database Systems', credit_hours: 3, grade: 'B+' },
        { profile_id: profile.id, subject_name: 'Web Engineering', credit_hours: 3, grade: 'A-' },
        { profile_id: profile.id, subject_name: 'Operating Systems', credit_hours: 3, grade: 'B' },
      ]);
    }
    await db
      .from('semester_records')
      .upsert(
        [
          { profile_id: profile.id, semester_label: 'Semester 1', gpa: 3.4, credits: 15 },
          { profile_id: profile.id, semester_label: 'Semester 2', gpa: 3.6, credits: 16 },
          { profile_id: profile.id, semester_label: 'Semester 3', gpa: 3.5, credits: 15 },
          { profile_id: profile.id, semester_label: 'Semester 4', gpa: 3.7, credits: 16 },
        ],
        { onConflict: 'id', ignoreDuplicates: true },
      );

    const { count: postCount } = await db
      .from('posts')
      .select('*', { count: 'exact', head: true });
    if ((postCount ?? 0) === 0) {
      await db.from('posts').insert([
        {
          author_id: profile.id,
          university_id: univ?.id ?? null,
          university_name: 'FAST-NUCES',
          category: 'opportunity',
          content: 'Google Summer of Code applications are open — great chance for students!',
        },
        {
          author_id: profile.id,
          university_id: univ?.id ?? null,
          university_name: 'FAST-NUCES',
          category: 'event',
          content: 'Our university is hosting a hackathon next month. Team up!',
        },
        {
          author_id: profile.id,
          university_id: univ?.id ?? null,
          university_name: 'FAST-NUCES',
          category: 'scholarship',
          content:
            'Reminder: HEC need-based scholarship portal is open this semester. Check eligibility and apply early!',
        },
        {
          author_id: profile.id,
          university_id: univ?.id ?? null,
          university_name: 'FAST-NUCES',
          category: 'achievement',
          content:
            'Our team reached the finals of the national programming contest. Proud moment for the CS department!',
        },
        {
          author_id: profile.id,
          university_id: univ?.id ?? null,
          university_name: 'FAST-NUCES',
          category: 'internship',
          content:
            'Systems Limited is hiring frontend interns — great opportunity if you know React. Apply via LinkedIn.',
        },
      ]);
    }

    // Enroll the demo student into a couple of societies for a lively demo.
    const { data: soc } = await db
      .from('societies')
      .select('id, slug')
      .in('slug', ['gdgoc', 'github-campus', 'cp-club']);
    for (const s of soc ?? []) {
      await db
        .from('society_memberships')
        .upsert(
          { society_id: s.id, profile_id: profile.id },
          { onConflict: 'society_id,profile_id', ignoreDuplicates: true },
        );
    }
  }
}

async function seedAdmins() {
  if (adminEmails.length === 0) {
    console.log('→ No ADMIN_EMAILS set; skipping admin creation.');
    return;
  }
  console.log('→ Seeding admin account(s)…');
  for (const email of adminEmails) {
    await ensureUser(email, 'AdminPass123', 'admin');
  }
}

async function main() {
  await seedUniversities();
  await seedRankings();
  await seedJobs();
  await seedNotes();
  await seedSocieties();
  await seedDemoStudent();
  await seedAdmins();
  console.log('\n✅ Seed complete.');
  console.log('   Demo student → demo.student@campus-advisor.dev / DemoPass123');
  if (adminEmails.length) console.log(`   Admin(s)      → ${adminEmails.join(', ')} / AdminPass123`);
}

main().catch((e) => {
  console.error('Seed failed:', e);
  process.exit(1);
});
