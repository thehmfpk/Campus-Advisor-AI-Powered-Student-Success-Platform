import { useState } from 'react';
import { toast } from 'sonner';
import { Building2, Bug, Lightbulb, Star, Lock } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  Input,
  Select,
  Tabs,
  Textarea,
} from '@/components/ui';
import { useProfile } from '@/features/profile/useProfile';
import {
  useFeatureRequests,
  useSubmitFeatureRequest,
  useSubmitPortalFeedback,
  useSubmitUniversityFeedback,
} from './useFeedback';
import type { FeatureStatus, FeedbackCategory } from '@/types/db';

const STATUS_TONE: Record<FeatureStatus, 'neutral' | 'brand' | 'warning' | 'success' | 'danger'> = {
  open: 'neutral',
  planned: 'brand',
  in_progress: 'warning',
  completed: 'success',
  rejected: 'danger',
};

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)} aria-label={`${n} stars`}>
          <Star className={`h-6 w-6 ${n <= value ? 'fill-warning text-warning' : 'text-muted'}`} />
        </button>
      ))}
    </div>
  );
}

function UniversityFeedbackTab() {
  const { data: profile } = useProfile();
  const submit = useSubmitUniversityFeedback(profile?.id, profile?.university_name);
  const [category, setCategory] = useState<FeedbackCategory>('teachers');
  const [rating, setRating] = useState(4);
  const [feedback, setFeedback] = useState('');

  const send = async () => {
    if (!feedback.trim()) return toast.error('Please write your feedback.');
    try {
      await submit.mutateAsync({ category, rating, feedback: feedback.trim() });
      setFeedback('');
      toast.success('Feedback submitted privately. Thank you!');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not submit.');
    }
  };

  return (
    <Card>
      <CardHeader
        title="University Feedback"
        subtitle="Private — only admins can review this. Never made public automatically."
        action={<Badge tone="neutral"><Lock className="h-3 w-3" /> Private</Badge>}
      />
      <CardBody className="space-y-4">
        <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value as FeedbackCategory)}>
          <option value="teachers">Teachers</option>
          <option value="staff">Staff</option>
          <option value="facilities">Facilities</option>
          <option value="academics">Academic system</option>
          <option value="administration">Administration</option>
          <option value="other">Other</option>
        </Select>
        <div>
          <label className="mb-1 block text-sm font-medium text-fg">Rating</label>
          <StarRating value={rating} onChange={setRating} />
        </div>
        <Textarea
          label="Your feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Share constructive feedback. Do not include private personal details about staff."
        />
        <Button onClick={send} loading={submit.isPending}>
          Submit privately
        </Button>
      </CardBody>
    </Card>
  );
}

function PortalFeedbackTab() {
  const { data: profile } = useProfile();
  const submit = useSubmitPortalFeedback(profile?.id);
  const [type, setType] = useState<'bug' | 'ux' | 'general'>('general');
  const [message, setMessage] = useState('');

  const send = async () => {
    if (!message.trim()) return toast.error('Please write a message.');
    try {
      await submit.mutateAsync({ type, message: message.trim() });
      setMessage('');
      toast.success('Thanks for helping us improve Campus Advisor!');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not submit.');
    }
  };

  return (
    <Card>
      <CardHeader title="Platform Feedback" subtitle="Report a bug or share how we can improve." />
      <CardBody className="space-y-4">
        <Select label="Type" value={type} onChange={(e) => setType(e.target.value as typeof type)}>
          <option value="general">General feedback</option>
          <option value="bug">Bug report</option>
          <option value="ux">UX feedback</option>
        </Select>
        <Textarea
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe the issue or idea…"
        />
        <Button onClick={send} loading={submit.isPending}>
          Send feedback
        </Button>
      </CardBody>
    </Card>
  );
}

function FeatureRequestTab() {
  const { data: profile } = useProfile();
  const { data: requests = [] } = useFeatureRequests(profile?.id);
  const submit = useSubmitFeatureRequest(profile?.id);
  const [form, setForm] = useState({ title: '', description: '', category: '', priority: 'medium' as const });

  const send = async () => {
    if (!form.title.trim() || !form.description.trim())
      return toast.error('Title and description are required.');
    try {
      await submit.mutateAsync(form);
      setForm({ title: '', description: '', category: '', priority: 'medium' });
      toast.success('Feature request submitted!');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not submit.');
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader title="Request a Feature" subtitle="Tell us what would make Campus Advisor better." />
        <CardBody className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Dark mode for CV export" />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. CV" />
            <Select label="Priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as typeof form.priority })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>
          <Button onClick={send} loading={submit.isPending}>
            Submit request
          </Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="My Requests" subtitle="Track the status of what you've requested." />
        <CardBody>
          {requests.length === 0 ? (
            <EmptyState icon={Lightbulb} title="No requests yet" description="Your submitted feature requests appear here." />
          ) : (
            <div className="space-y-3">
              {requests.map((r) => (
                <div key={r.id} className="rounded-xl border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-fg">{r.title}</p>
                    <Badge tone={STATUS_TONE[r.status]}>{r.status.replace('_', ' ')}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted">{r.description}</p>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default function FeedbackPage() {
  const [tab, setTab] = useState('university');
  return (
    <div>
      <PageHeader title="Feedback & Requests" description="Share university feedback, report issues, or request new features." />
      <Tabs
        active={tab}
        onChange={setTab}
        tabs={[
          { key: 'university', label: 'University Feedback', icon: <Building2 className="h-4 w-4" /> },
          { key: 'portal', label: 'Platform Feedback', icon: <Bug className="h-4 w-4" /> },
          { key: 'feature', label: 'Feature Requests', icon: <Lightbulb className="h-4 w-4" /> },
        ]}
      />
      {tab === 'university' && <UniversityFeedbackTab />}
      {tab === 'portal' && <PortalFeedbackTab />}
      {tab === 'feature' && <FeatureRequestTab />}
    </div>
  );
}
