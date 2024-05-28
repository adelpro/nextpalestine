import React from 'react';

import ResetPassword from './ResetPassword';

export async function generateMetadata() {
  const title = 'Reset password - ' + process.env.NEXT_PUBLIC_APP_NAME;
  const description =
    'Reset password page for ' + process.env.NEXT_PUBLIC_APP_NAME;

  return {
    title,
    description,
  };
}
export default function page() {
  return <ResetPassword />;
}
