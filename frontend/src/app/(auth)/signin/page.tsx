import React from 'react';

import Signin from './Signin';

export async function generateMetadata() {
  const title = 'Sign in - ' + process.env.NEXT_PUBLIC_APP_NAME;
  const description = 'Sign in page for ' + process.env.NEXT_PUBLIC_APP_NAME;

  return {
    title,
    description,
  };
}
export default function page() {
  return <Signin />;
}
