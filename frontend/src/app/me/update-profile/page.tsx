import React from 'react';

import UpdateProfile from './UpdateProfile';
import { env } from '@/utils/env';

export async function generateMetadata() {
  const title = 'Update profile - ' + process.env.NEXT_PUBLIC_APP_NAME;
  const description =
    'Update profile page for ' + process.env.NEXT_PUBLIC_APP_NAME;

  return {
    title,
    description,
  };
}
export default function page() {
  return <UpdateProfile />;
}
