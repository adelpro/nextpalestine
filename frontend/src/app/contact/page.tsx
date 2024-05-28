import React from 'react';

import Contact from './Contact';

export async function generateMetadata() {
  const title = 'Contact - ' + process.env.NEXT_PUBLIC_APP_NAME;
  const description = 'Contact page for ' + process.env.NEXT_PUBLIC_APP_NAME;

  return {
    title,
    description,
  };
}
export default function page() {
  return <Contact />;
}
