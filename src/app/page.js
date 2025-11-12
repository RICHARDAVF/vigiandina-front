'use client';
import '@ant-design/v5-patch-for-react-19';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/utils/constants';
import Loading from '@/components/shared/Loading';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push(ROUTES.ADMIN);
      } else {
        router.push(ROUTES.LOGIN);
      }
    }
  }, [isAuthenticated, loading, router]);

  return <Loading fullScreen tip="Redirigiendo..." />;
}