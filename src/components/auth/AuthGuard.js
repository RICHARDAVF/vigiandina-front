'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/utils/constants';
import Loading from '@/components/shared/Loading';

export default function AuthGuard({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`${ROUTES.LOGIN}?redirect=${pathname}`);
    }
  }, [isAuthenticated, loading, router, pathname]);

  if (loading) {
    return <Loading fullScreen tip="Verificando autenticación..." />;
  }

  if (!isAuthenticated) {
    return <Loading fullScreen tip="Redirigiendo..." />;
  }

  return <>{children}</>;
}