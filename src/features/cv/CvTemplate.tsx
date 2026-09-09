import type { CvData } from './useCv';

/**
 * ATS-friendly CV template (R8): single column, standard headings, semantic
 * markup — prints cleanly to PDF via the browser. An optional profile photo is
 * shown in the header (photos are fine for many modern/EU CV styles; leave it
 * off for strict US ATS submissions).
 */
export function CvTemplate({ cv, avatarUrl }: { cv: CvData; avatarUrl?: string | null }) {
  const name = cv.personal?.full_name || 'Your Name';
  const contact = [cv.personal?.email, cv.personal?.phone, cv.personal?.location]
    .filter(Boolean)
    .join('  •  ');

  return (
    <div
      id="cv-print-area"
      className="mx-auto max-w-[800px] bg-white p-10 text-[13px] leading-relaxed text-neutral-900"
      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
    >
      {/* accent bar */}
      <div className="mb-4 h-1.5 w-full rounded-full" style={{ background: 'linear-gradient(90deg,#2563eb,#06b6d4)' }} />

      <header className="flex items-start justify-between gap-4 border-b-2 border-neutral-800 pb-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
          {cv.headline && <p className="mt-0.5 text-neutral-700">{cv.headline}</p>}
          {contact && <p className="mt-1 text-xs text-neutral-600">{contact}</p>}
          {cv.links.length > 0 && (
            <p className="mt-1 text-xs text-neutral-600">
              {cv.links.map((l, i) => (
                <span key={i}>
                  {i > 0 && '  •  '}
                  {l.label}: {l.url}
                </span>
              ))}
            </p>
          )}
        </div>
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt={name}
            className="h-24 w-24 shrink-0 rounded-lg border border-neutral-300 object-cover"
          />
        )}
      </header>

      {cv.summary && (
        <Section title="Summary">
          <p>{cv.summary}</p>
        </Section>
      )}

      {cv.skills.length > 0 && (
        <Section title="Skills">
          <p>{cv.skills.join('  •  ')}</p>
        </Section>
      )}

      {cv.experience.length > 0 && (
        <Section title="Experience">
          {cv.experience.map((e, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between">
                <span className="font-semibold">
                  {e.title}, {e.org}
                </span>
                <span className="text-xs text-neutral-600">
                  {e.start} – {e.end}
                </span>
              </div>
              <ul className="ml-5 list-disc">
                {e.bullets.filter(Boolean).map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {cv.projects.length > 0 && (
        <Section title="Projects">
          {cv.projects.map((p, i) => (
            <div key={i} className="mb-2">
              <span className="font-semibold">{p.name}</span>
              {p.tech.length > 0 && (
                <span className="text-xs text-neutral-600"> — {p.tech.join(', ')}</span>
              )}
              <p>{p.description}</p>
              {p.link && <p className="text-xs text-neutral-600">{p.link}</p>}
            </div>
          ))}
        </Section>
      )}

      {cv.education.length > 0 && (
        <Section title="Education">
          {cv.education.map((e, i) => (
            <div key={i} className="mb-1 flex justify-between">
              <span>
                <span className="font-semibold">{e.degree}</span>, {e.institution}
                {e.grade && <span className="text-neutral-600"> (GPA/Grade: {e.grade})</span>}
              </span>
              <span className="text-xs text-neutral-600">
                {e.start} – {e.end}
              </span>
            </div>
          ))}
        </Section>
      )}

      {cv.certifications.length > 0 && (
        <Section title="Certifications">
          <ul className="ml-5 list-disc">
            {cv.certifications.map((c, i) => (
              <li key={i}>
                {c.name}
                {c.issuer ? `, ${c.issuer}` : ''}
                {c.year ? ` (${c.year})` : ''}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {cv.achievements.length > 0 && (
        <Section title="Achievements">
          <ul className="ml-5 list-disc">
            {cv.achievements.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </Section>
      )}

      {cv.languages.length > 0 && (
        <Section title="Languages">
          <p>{cv.languages.join('  •  ')}</p>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-4">
      <h2 className="mb-1 border-b border-neutral-300 pb-0.5 text-sm font-bold uppercase tracking-wide text-neutral-800">
        {title}
      </h2>
      {children}
    </section>
  );
}
