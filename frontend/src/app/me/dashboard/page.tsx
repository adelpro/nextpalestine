import Dashboard from './dashboard';
import React from 'react';

export async function generateMetadata() {
  const title = 'Dashboard - ' + process.env.NEXT_PUBLIC_APP_NAME;
  const description = 'Dashboard page for ' + process.env.NEXT_PUBLIC_APP_NAME;

  return {
    title,
    description,
  };
}
export default function page() {
  return <Dashboard />;
}
