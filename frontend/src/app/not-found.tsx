import { Link } from 'next-view-transitions';
import Image from 'next/image';

import failSVG from '@/svgs/fail.svg';

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 mt-4 bg-gray-100">
      <div className="w-full max-w-md p-6 text-center bg-white rounded-lg shadow-lg">
        <h2 className="mt-4 text-2xl font-bold">
          Oops! We can&apos;t find that page.
        </h2>
        <Image
          src={failSVG}
          alt="Page Not Found"
          width={200}
          height={200}
          className="mx-auto"
          priority
        />
        <p className="mt-4 text-gray-600">
          It looks like the URL you entered might be incorrect, or the page
          might have been moved or deleted.
        </p>

        <div className="mt-6">
          <Link
            href="/"
            className="inline-block w-full px-4 py-2 font-medium text-white rounded-md bg-brand-CTA-blue-500 hover:bg-brand-CTA-blue-600"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
