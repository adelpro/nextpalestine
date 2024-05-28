import React from 'react';

import AccountActivation from './AccountActivation';
import { env } from '@/utils/env';

export async function generateMetadata() {
  const title = 'Account activation - ' + process.env.NEXT_PUBLIC_APP_NAME;
  const description =
    'Account activation page for ' + process.env.NEXT_PUBLIC_APP_NAME;

  return {
    title,
    description,
  };
}
export default function page() {
  return <AccountActivation />;
}
