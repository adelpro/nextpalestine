import React from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="p-4 animate-appear">{children}</div>;
}
