import dynamic from 'next/dynamic';

import MyTokens from '@/components/myTokens';
import Skeleton from '@/components/skeleton';
import Me from '@/components/me';

export default function Dashbaoard() {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <h1 className="mb-8 mt-8 text-4xl font-bold">Dashboard</h1>
      <div className="w-full bg-white p-8">
        <Me />
        <div className="mt-8">
          <MyTokens />
        </div>
      </div>
    </div>
  );
}
