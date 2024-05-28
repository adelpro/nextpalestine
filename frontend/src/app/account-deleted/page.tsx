import React from 'react';

import AccountDeleted from './AccountDeleted';
import { env } from '@/utils/env';

export async function generateMetadata() {
  const title = 'Account deleted - ' + process.env.NEXT_PUBLIC_APP_NAME;
  const description =
    'Account deleted page for ' + process.env.NEXT_PUBLIC_APP_NAME;

  return {
    title,
    description,
  };
}
export default function page() {
  return <AccountDeleted />;
}
