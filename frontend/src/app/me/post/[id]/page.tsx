import type { Metadata } from 'next';
import ShowPost from './showPost';
import React from 'react';

export async function generateMetadata(): Promise<Metadata> {
  const title = process.env.NEXT_PUBLIC_APP_NAME + ' | Post';
  const description = process.env.NEXT_PUBLIC_APP_NAME + ' - Post page';
  return {
    title,
    description,
  };
}

export default function Page() {
  return <ShowPost />;
}
