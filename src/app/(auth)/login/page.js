'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/utils/constants';
import LoginForm from '@/components/auth/LoginForm';
import Loading from '@/components/shared/Loading';

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push(ROUTES.ADMIN);
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <Loading fullScreen tip="Cargando..." />;
  }

  if (isAuthenticated) {
    return <Loading fullScreen tip="Redirigiendo al panel..." />;
  }

  return <LoginForm />;
}