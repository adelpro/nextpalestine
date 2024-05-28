import MeProfile from './meProfile';
import React from 'react';
export async function generateMetadata() {
  const title = 'Profile - ' + process.env.NEXT_PUBLIC_APP_NAME;
  const description = 'Profile page for ' + process.env.NEXT_PUBLIC_APP_NAME;

  return {
    title,
    description,
  };
}
export default function page() {
  return <MeProfile />;
}
