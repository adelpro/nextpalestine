'use client';

import dynamic from 'next/dynamic';

import UseMe from '@/hooks/useMe';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};
export default function MeLayout({ children }: Props) {
  const { isLoadingMe } = UseMe();
  const Skeleton = dynamic(() => import('@/components/skeleton'), {
    ssr: false,
  });
  if (isLoadingMe) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Skeleton />
      </div>
    );
  }
  return <>{children}</>;
}
