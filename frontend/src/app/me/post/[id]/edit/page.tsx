import React from 'react';

import EditPost from './editPost';

export async function generateMetadata() {
  const title = 'Edit post - ' + process.env.NEXT_PUBLIC_APP_NAME;
  const description = 'Edit post page for ' + process.env.NEXT_PUBLIC_APP_NAME;
  return {
    title,
    description,
  };
}
export default function Page() {
  return <EditPost />;
}
