'use client';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};
export default function AuthLayout({ children }: Props) {
  return <>{children}</>;
}
