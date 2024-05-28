import React from 'react';

import AccountActivationToken from './AccountActivationToken';
import { env } from '@/utils/env';

export async function generateMetadata() {
  const title =
    'Account activation token - ' + process.env.NEXT_PUBLIC_APP_NAME;
  const description =
    'Account activation token page for ' + process.env.NEXT_PUBLIC_APP_NAME;

  return {
    title,
    description,
  };
}
export default function page() {
  return <AccountActivationToken />;
}
