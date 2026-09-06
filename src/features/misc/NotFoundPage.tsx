import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center">
      <p className="text-5xl font-bold text-brand">404</p>
      <h1 className="mt-3 text-lg font-semibold text-fg">Page not found</h1>
      <p className="mt-1 text-sm text-muted">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6">
        <Button variant="secondary">Back to home</Button>
      </Link>
    </div>
  );
}
