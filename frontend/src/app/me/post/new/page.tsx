import React from 'react';

import { env } from '@/utils/env';
import NewPost from './newPost';
export async function generateMetadata() {
  const title = 'New post - ' + process.env.NEXT_PUBLIC_APP_NAME;
  const description = 'New post page for ' + process.env.NEXT_PUBLIC_APP_NAME;

  return {
    title,
    description,
  };
}
export default function page() {
  return <NewPost />;
}
