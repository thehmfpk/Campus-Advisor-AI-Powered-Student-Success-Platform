import { Sparkles } from 'lucide-react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  ErrorState,
  Input,
  Select,
  Skeleton,
  SkeletonText,
  Textarea,
} from '@/components/ui';
import { ThemeToggle } from '@/components/ThemeToggle';

/**
 * Dev-only page to visually verify every UI primitive in light + dark
 * (Phase 1, task 1.3). Not shipped in production builds (route is DEV-gated).
 */
export default function KitchenSinkPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-fg">UI Kitchen Sink</h1>
        <ThemeToggle />
      </div>

      <Card>
        <CardHeader title="Buttons" subtitle="Variants, sizes, loading" />
        <CardBody className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button loading>Loading</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Badges & Avatar" />
        <CardBody className="flex flex-wrap items-center gap-3">
          <Badge tone="brand">
            <Sparkles className="h-3 w-3" /> AI Match: 87%
          </Badge>
          <Badge tone="accent">Accent</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="danger">Danger</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="neutral">Neutral</Badge>
          <Avatar name="Faizan Ahmed" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Form fields" />
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <Input label="Full name" placeholder="Faizan Ahmed" />
          <Input label="Email" type="email" placeholder="you@uni.edu" error="Invalid email" />
          <Select label="Semester">
            <option>Semester 1</option>
            <option>Semester 2</option>
          </Select>
          <Textarea label="Bio" placeholder="Short bio…" hint="Max 280 characters" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Loading / Empty / Error states" />
        <CardBody className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Skeleton className="h-24 w-full" />
            <SkeletonText lines={2} />
          </div>
          <EmptyState title="No data yet" description="Nothing to show." />
          <ErrorState onRetry={() => undefined} />
        </CardBody>
      </Card>
    </div>
  );
}
