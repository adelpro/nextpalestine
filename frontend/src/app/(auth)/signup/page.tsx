import React from 'react';

import { env } from '@/utils/env';
import Signup from './Signup';

export async function generateMetadata() {
  const title = 'Sign up - ' + process.env.NEXT_PUBLIC_APP_NAME;
  const description = 'Sign up page for ' + process.env.NEXT_PUBLIC_APP_NAME;

  return {
    title,
    description,
  };
}
export default function page() {
  return <Signup />;
}
