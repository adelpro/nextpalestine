import Image from 'next/image';
import Link from 'next/link';

import successSVG from '@/svgs/success.svg';

export default function AccountDeleted() {
  return (
    <div className="flex items-center mt-4 justify-center min-h-screen p-4 bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <h2 className="mt-4 text-2xl font-bold">Account Deleted</h2>
        <Image
          src={successSVG}
          alt="Success"
          width={200}
          height={200}
          className="mx-auto"
        />
        <p className="mt-4 text-gray-600"></p>

        <div className="mt-6">
          <Link
            href="/"
            className="w-full inline-block px-4 py-2 font-medium text-white bg-brand-CTA-blue-500 rounded-md hover:bg-brand-CTA-blue-600"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
