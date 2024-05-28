import Skeleton from '@/components/skeleton';
import React from 'react';

export default function loading() {
  return (
    <div className="flex justify-center items-center mt-10">
      <Skeleton />
    </div>
  );
}
