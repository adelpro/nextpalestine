import React from 'react';

import TwoFA from './TwoFA';

export async function generateMetadata() {
  const title = '2FA - ' + process.env.NEXT_PUBLIC_APP_NAME;
  const description = '2FA page for ' + process.env.NEXT_PUBLIC_APP_NAME;

  return {
    title,
    description,
  };
}
export default function page() {
  return <TwoFA />;
}
