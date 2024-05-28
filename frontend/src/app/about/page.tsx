import React from 'react';

import { env } from '@/utils/env';
import About from './About';

export async function generateMetadata() {
  const title = 'About - ' + process.env.NEXT_PUBLIC_APP_NAME;
  const description = 'About page for ' + process.env.NEXT_PUBLIC_APP_NAME;

  return {
    title,
    description,
  };
}
export default function page() {
  return <About />;
}
