import React from 'react';

import { env } from '@/utils/env';
import Home from './Home';

export async function generateMetadata() {
  const title = 'Welcome to ' + process.env.NEXT_PUBLIC_APP_NAME;
  const description = 'Home page for ' + process.env.NEXT_PUBLIC_APP_NAME;
  const openGraph = {
    title,
    description,
  };

  return {
    title,
    description,
    openGraph,
  };
}
export default function page() {
  return <Home />;
}
