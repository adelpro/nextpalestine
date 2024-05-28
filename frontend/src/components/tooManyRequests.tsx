'use client';

import { isThrottled } from '@/recoil/store';
import { useRouter } from 'next/navigation';
import dangerSVG from '@/svgs/danger.svg';
import { useRecoilValue } from 'recoil';
import { useEffect } from 'react';
import Image from 'next/image';
export default function TooManyRequests() {
  const isThrottledValue = useRecoilValue(isThrottled);
  const router = useRouter();

  useEffect(() => {
    if (!isThrottledValue) {
      router.replace('/');
    }
  }, [isThrottledValue, router]);

  if (!isThrottledValue) {
    return <></>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-8 pt-24 md:px-24">
      <div className="w-450 mx-auto flex flex-col items-center justify-center rounded-md border border-gray-300 p-4 md:p-10">
        <h2 className="mt-4 text-2xl font-bold">Too Many Requests</h2>
        <Image
          src={dangerSVG}
          alt="Danger SVG"
          width={200}
          height={200}
          className="mx-auto"
        />
        <div className="mt-4">
          <p className="mb-2 block text-left text-gray-600">
            Too many requests, please try again later.
          </p>
        </div>
      </div>
    </main>
  );
}
