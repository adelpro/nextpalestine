'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

import successSVG from '@/svgs/success.svg';
import { useEffect } from 'react';

export default function Success() {
  const searchParams = useSearchParams();

  const title = searchParams.get('title')?.toString()
    ? searchParams.get('title')?.toString()
    : 'Success!';

  const router = useRouter();

  useEffect(() => {
    const closeTabTimeout = setTimeout(() => {
      router.replace('/');
    }, 2000);

    return () => {
      clearTimeout(closeTabTimeout);
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="mb-4 text-4xl font-bold text-center text-blue-800 md:text-5xl">
        {title}
      </h1>
      <p className="mb-6 text-lg text-gray-600 md:text-xl">
        You&apos;ll be redirected in a moment...
      </p>
      <Image
        src={successSVG}
        alt="Success Icon"
        className="w-20 h-20 md:w-24 md:h-24 animate-bounce"
      />
    </div>
  );
}
