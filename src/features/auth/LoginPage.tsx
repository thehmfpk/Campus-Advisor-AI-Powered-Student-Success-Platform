import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthLayout } from './AuthLayout';
import { useAuth } from './AuthContext';
import { signInSchema, type SignInValues } from './authSchemas';
import { Button, Input } from '@/components/ui';

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>();

  const onSubmit = handleSubmit(async (raw) => {
    const parsed = signInSchema.safeParse(raw);
    if (!parsed.success) {
      toast.error('Please check your details.');
      return;
    }
    setSubmitting(true);
    try {
      await signIn(parsed.data.email, parsed.data.password);
      toast.success('Welcome back!');
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from ?? '/app/dashboard', { replace: true });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Sign in failed.');
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your campus journey."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-medium text-brand hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Input
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@university.edu"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" className="w-full" loading={submitting}>
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}
