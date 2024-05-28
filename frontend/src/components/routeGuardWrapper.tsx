'use client';

import TooManyRequests from '@/components/tooManyRequests';
import { isThrottled } from '@/recoil/store';
import { useRecoilValue } from 'recoil';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};
export default function RouteGuardWrapper({ children }: Props) {
  const isThrottledValue = useRecoilValue(isThrottled);

  // Throttling guard
  // After 60sec it will automaticly redirect to '/'
  if (isThrottledValue) return <TooManyRequests />;

  //No guard
  return <>{children}</>;
}
