'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export const useRedirect = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [redirectTo, setRedirectTo] = useState(null);

  useEffect(() => {
    const redirect = searchParams.get('redirect');
    if (redirect) {
      setRedirectTo(redirect);
    }
  }, [searchParams]);

  const redirectAfterLogin = (defaultPath = '/admin') => {
    const path = redirectTo || defaultPath;
    router.push(path);
  };

  return { redirectAfterLogin, redirectTo };
};