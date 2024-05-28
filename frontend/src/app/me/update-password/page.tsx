import React from 'react';

import UpdatePassword from './UpdatePassword';
import { env } from '@/utils/env';

export async function generateMetadata() {
  const title = 'Update password - ' + process.env.NEXT_PUBLIC_APP_NAME;
  const description =
    'Update password page for ' + process.env.NEXT_PUBLIC_APP_NAME;

  return {
    title,
    description,
  };
}
export default function page() {
  return <UpdatePassword />;
}
