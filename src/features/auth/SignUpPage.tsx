import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthLayout } from './AuthLayout';
import { useAuth } from './AuthContext';
import { signUpSchema, type SignUpValues } from './authSchemas';
import { Button, Input, Select } from '@/components/ui';

export default function SignUpPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpValues>();

  const onSubmit = handleSubmit(async (raw) => {
    const parsed = signUpSchema.safeParse(raw);
    if (!parsed.success) {
      toast.error('Please fix the highlighted fields.');
      return;
    }
    setSubmitting(true);
    try {
      await signUp(parsed.data);
      toast.success('Account created! Complete your profile next.');
      navigate('/app/profile', { replace: true });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Sign up failed.');
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join Campus Advisor and get personalized guidance."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Input
          id="fullName"
          label="Full name"
          placeholder="Faizan Ahmed"
          error={errors.fullName?.message}
          {...register('fullName')}
        />
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
          autoComplete="new-password"
          placeholder="At least 8 characters"
          error={errors.password?.message}
          {...register('password')}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            id="rollNumber"
            label="Roll number"
            placeholder="BSCS-F21-123"
            error={errors.rollNumber?.message}
            {...register('rollNumber')}
          />
          <Select
            id="semester"
            label="Semester"
            error={errors.semester?.message}
            defaultValue="1"
            {...register('semester')}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Semester {i + 1}
              </option>
            ))}
          </Select>
        </div>
        <Input
          id="university"
          label="University"
          placeholder="FAST-NUCES"
          error={errors.university?.message}
          {...register('university')}
        />
        <Input
          id="department"
          label="Department"
          placeholder="Computer Science"
          error={errors.department?.message}
          {...register('department')}
        />
        <Button type="submit" className="w-full" loading={submitting}>
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
