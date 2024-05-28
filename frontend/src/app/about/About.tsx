import React from 'react';

export default function About() {
  return (
    <main className="flex flex-col items-center justify-center p-6 mt-5 bg-gradient-to-b from-gray-50 to-white">
      <h1 className="text-3xl font-bold text-brand-CTA-blue-600">
        nextpalestine
      </h1>
      <p className="mt-4 text-base text-center text-gray-600">
        Your one-stop platform for developers to share,
        <br />
        innovate, and grow their online presence
      </p>

      <ul className="mt-8 text-base text-gray-700 list-disc">
        <li className="mb-6">
          <strong className="text-brand-CTA-blue-600">
            Seamless Integration:
          </strong>{' '}
          A world-class development environment built on industry-leading
          technologies.
        </li>
        <li className="mb-6">
          <strong className="text-brand-CTA-blue-600">
            Secure Authentication:
          </strong>{' '}
          Rest assured knowing your account and content are protected with
          secure cookies and robust user management.
        </li>
        <li className="mb-6">
          <strong className="text-brand-CTA-blue-600">MongoDB:</strong> Leverage
          the flexibility and scalability of a NoSQL database for efficient
          content management.
        </li>
        <li className="mb-6">
          <strong className="text-brand-CTA-blue-600">
            Rich Content Editing:
          </strong>{' '}
          Craft engaging blog posts using our powerful lexical editor. Explore
          custom nodes like code snippets, syntax highlighting, and interactive
          elements to enhance your writing.
        </li>
        <li className="mb-6">
          <strong className="text-brand-CTA-blue-600">
            Seamless Image Integration:
          </strong>{' '}
          Effortlessly add and manage images within your posts, ensuring visual
          appeal and proper copyright attribution through secure proxy
          endpoints.
        </li>
        <li className="mb-6">
          <strong className="text-brand-CTA-blue-600">
            Personalized Profiles:
          </strong>{' '}
          Create a unique identity on nextpalestine. Upload a profile image to
          showcase your personality and build recognition within the developer
          community.
        </li>
        <li className="mb-6">
          <strong className="text-brand-CTA-blue-600">
            Intuitive Dashboard:
          </strong>{' '}
          Gain valuable insights into your audience and manage your blog
          effectively with a user-friendly, role-based dashboard.
        </li>
      </ul>
    </main>
  );
}
