import React from 'react';

import Success from './Success';

export async function generateMetadata() {
  const title = 'Success - ' + process.env.NEXT_PUBLIC_APP_NAME;
  const description = 'Success page for ' + process.env.NEXT_PUBLIC_APP_NAME;

  return {
    title,
    description,
  };
}
export default function Page() {
  return <Success />;
}
