import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Download, Save, Sparkles, Plus, Trash2, Wand2 } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Skeleton,
  Textarea,
} from '@/components/ui';
import { useProfile } from '@/features/profile/useProfile';
import { useAuth } from '@/features/auth/AuthContext';
import { api } from '@/lib/api';
import { CvTemplate } from './CvTemplate';
import { emptyCv, useCv, useSaveCv, type CvData } from './useCv';
import { ChatMarkdown } from '@/features/advisor/ChatMarkdown';

function useCommaList(initial: string[]) {
  const [text, setText] = useState(initial.join(', '));
  useEffect(() => setText(initial.join(', ')), [initial.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps
  const toArray = () =>
    text
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  return { text, setText, toArray };
}

export default function CvPage() {
  const { data: profile, isLoading: loadingProfile } = useProfile();
  const { data: saved, isLoading: loadingCv } = useCv(profile?.id);
  const saveCv = useSaveCv(profile?.id);
  const { accessToken } = useAuth();

  const [cv, setCv] = useState<CvData>(emptyCv);
  const [aiText, setAiText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [targetRole, setTargetRole] = useState('');

  const skills = useCommaList(cv.skills);
  const languages = useCommaList(cv.languages);

  useEffect(() => {
    if (saved) setCv({ ...emptyCv, ...saved });
    else if (profile) {
      setCv((c) => ({
        ...c,
        personal: { ...c.personal, full_name: profile.full_name },
        skills: profile.skills ?? [],
      }));
    }
  }, [saved, profile]);

  const patch = (p: Partial<CvData>) => setCv((c) => ({ ...c, ...p }));

  const handleSave = async () => {
    const next = { ...cv, skills: skills.toArray(), languages: languages.toArray() };
    setCv(next);
    try {
      await saveCv.mutateAsync(next);
      toast.success('CV saved.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not save CV.');
    }
  };

  const handlePrint = () => {
    document.body.classList.add('printing-cv');
    const cleanup = () => {
      document.body.classList.remove('printing-cv');
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    window.print();
  };

  const handleAiReview = async () => {
    setAiLoading(true);
    setAiText('');
    try {
      const res = await api<{ text: string; usedFallback: boolean }>('/ai/cv-review', {
        method: 'POST',
        token: accessToken ?? undefined,
        body: { cv: { ...cv, skills: skills.toArray() }, targetRole },
      });
      setAiText(res.text);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'AI review failed.');
    } finally {
      setAiLoading(false);
    }
  };

  if (loadingProfile || loadingCv) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  const previewCv = { ...cv, skills: skills.toArray(), languages: languages.toArray() };

  return (
    <div>
      <PageHeader
        title="AI CV Builder"
        description="Build a clean, ATS-friendly CV and get AI suggestions. Export with your browser (print → Save as PDF)."
        action={
          <div className="flex gap-2 no-print">
            <Button variant="secondary" onClick={handleSave} loading={saveCv.isPending}>
              <Save className="h-4 w-4" /> Save
            </Button>
            <Button onClick={handlePrint}>
              <Download className="h-4 w-4" /> Download PDF
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor */}
        <div className="space-y-6 no-print">
          <Card>
            <CardHeader title="Personal & summary" />
            <CardBody className="grid gap-3 sm:grid-cols-2">
              <Input label="Full name" value={cv.personal?.full_name ?? ''} onChange={(e) => patch({ personal: { ...cv.personal, full_name: e.target.value } })} />
              <Input label="Headline" value={cv.headline ?? ''} placeholder="Aspiring Frontend Developer" onChange={(e) => patch({ headline: e.target.value })} />
              <Input label="Email" value={cv.personal?.email ?? ''} onChange={(e) => patch({ personal: { ...cv.personal, email: e.target.value } })} />
              <Input label="Phone" value={cv.personal?.phone ?? ''} onChange={(e) => patch({ personal: { ...cv.personal, phone: e.target.value } })} />
              <Input label="Location" value={cv.personal?.location ?? ''} onChange={(e) => patch({ personal: { ...cv.personal, location: e.target.value } })} />
              <div className="sm:col-span-2">
                <Textarea label="Summary" value={cv.summary ?? ''} onChange={(e) => patch({ summary: e.target.value })} placeholder="2-3 lines about you and your goals." />
              </div>
              <div className="sm:col-span-2">
                <Input label="Skills (comma separated)" value={skills.text} onChange={(e) => skills.setText(e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <Input label="Languages (comma separated)" value={languages.text} onChange={(e) => languages.setText(e.target.value)} />
              </div>
            </CardBody>
          </Card>

          <RepeatingSection
            title="Experience"
            items={cv.experience}
            onAdd={() => patch({ experience: [...cv.experience, { title: '', org: '', start: '', end: '', bullets: [''] }] })}
            onRemove={(i) => patch({ experience: cv.experience.filter((_, idx) => idx !== i) })}
            render={(item, i) => (
              <div className="grid gap-2 sm:grid-cols-2">
                <Input placeholder="Title" value={item.title} onChange={(e) => updateArr('experience', i, { title: e.target.value })} />
                <Input placeholder="Organization" value={item.org} onChange={(e) => updateArr('experience', i, { org: e.target.value })} />
                <Input placeholder="Start (e.g. 2024)" value={item.start} onChange={(e) => updateArr('experience', i, { start: e.target.value })} />
                <Input placeholder="End (e.g. Present)" value={item.end} onChange={(e) => updateArr('experience', i, { end: e.target.value })} />
                <div className="sm:col-span-2">
                  <Textarea placeholder="Bullet points (one per line)" value={item.bullets.join('\n')} onChange={(e) => updateArr('experience', i, { bullets: e.target.value.split('\n') })} />
                </div>
              </div>
            )}
          />

          <RepeatingSection
            title="Projects"
            items={cv.projects}
            onAdd={() => patch({ projects: [...cv.projects, { name: '', description: '', tech: [], link: '' }] })}
            onRemove={(i) => patch({ projects: cv.projects.filter((_, idx) => idx !== i) })}
            render={(item, i) => (
              <div className="grid gap-2">
                <Input placeholder="Project name" value={item.name} onChange={(e) => updateArr('projects', i, { name: e.target.value })} />
                <Textarea placeholder="Description" value={item.description} onChange={(e) => updateArr('projects', i, { description: e.target.value })} />
                <Input placeholder="Tech (comma separated)" value={item.tech.join(', ')} onChange={(e) => updateArr('projects', i, { tech: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} />
                <Input placeholder="Link" value={item.link ?? ''} onChange={(e) => updateArr('projects', i, { link: e.target.value })} />
              </div>
            )}
          />

          <RepeatingSection
            title="Education"
            items={cv.education}
            onAdd={() => patch({ education: [...cv.education, { institution: '', degree: '', start: '', end: '', grade: '' }] })}
            onRemove={(i) => patch({ education: cv.education.filter((_, idx) => idx !== i) })}
            render={(item, i) => (
              <div className="grid gap-2 sm:grid-cols-2">
                <Input placeholder="Degree" value={item.degree} onChange={(e) => updateArr('education', i, { degree: e.target.value })} />
                <Input placeholder="Institution" value={item.institution} onChange={(e) => updateArr('education', i, { institution: e.target.value })} />
                <Input placeholder="Start" value={item.start} onChange={(e) => updateArr('education', i, { start: e.target.value })} />
                <Input placeholder="End" value={item.end} onChange={(e) => updateArr('education', i, { end: e.target.value })} />
                <Input placeholder="Grade/GPA" value={item.grade ?? ''} onChange={(e) => updateArr('education', i, { grade: e.target.value })} />
              </div>
            )}
          />

          {/* AI Advisor */}
          <Card>
            <CardHeader
              title={<span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand" /> CV Advisor</span>}
              subtitle="Get AI feedback on wording, weaknesses, and missing skills."
            />
            <CardBody className="space-y-3">
              <Input label="Target role (optional)" placeholder="Frontend Developer" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
              <Button onClick={handleAiReview} loading={aiLoading}>
                <Wand2 className="h-4 w-4" /> Review my CV
              </Button>
              {aiText && (
                <div className="rounded-xl border border-border bg-surface-2 p-4">
                  <ChatMarkdown text={aiText} />
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Live preview */}
        <div>
          <div className="mb-2 flex items-center gap-2 no-print">
            <Badge tone="neutral">Live preview</Badge>
            <Badge tone="success">ATS-friendly</Badge>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border shadow-card">
            <CvTemplate cv={previewCv} />
          </div>
        </div>
      </div>
    </div>
  );

  // Helper to update an item within an array field.
  function updateArr<K extends 'experience' | 'projects' | 'education'>(
    key: K,
    index: number,
    p: Partial<CvData[K][number]>,
  ) {
    setCv((c) => ({
      ...c,
      [key]: (c[key] as CvData[K]).map((item, i) => (i === index ? { ...item, ...p } : item)),
    }));
  }
}

function RepeatingSection<T>({
  title,
  items,
  onAdd,
  onRemove,
  render,
}: {
  title: string;
  items: T[];
  onAdd: () => void;
  onRemove: (i: number) => void;
  render: (item: T, i: number) => React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader
        title={title}
        action={
          <Button size="sm" variant="secondary" onClick={onAdd}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        }
      />
      <CardBody className="space-y-4">
        {items.length === 0 && <p className="text-sm text-muted">No {title.toLowerCase()} added yet.</p>}
        {items.map((item, i) => (
          <div key={i} className="rounded-xl border border-border p-3">
            <div className="mb-2 flex justify-end">
              <button onClick={() => onRemove(i)} className="text-muted hover:text-danger" aria-label="Remove">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {render(item, i)}
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
