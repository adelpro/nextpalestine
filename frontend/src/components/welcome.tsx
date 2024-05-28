'use client';

import Image from 'next/image';

import { Link } from 'next-view-transitions';
import useSignout from '@/hooks/useSignout';
import appLogoSVG from '@/svgs/appLogo.svg';
import UseMe from '@/hooks/useMe';

import Spinner from './spinner';

export default function Welcome({ appName = 'App' }) {
  const { signoutMutation } = useSignout();

  const { me } = UseMe();
  const handleSignout = () => {
    signoutMutation.mutateAsync();
  };

  if (!me) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-24">
        <Image
          src={appLogoSVG}
          alt="Signout"
          width={200}
          height={200}
          className="mx-auto"
          priority
        />
        <h1 className="mb-8 text-4xl font-bold text-center">{`Welcome to ${appName}`}</h1>
        <div className="text-center">
          <p className="mb-4">
            To get started, please sign in or create an account.
          </p>
          <div className="flex flex-col items-center justify-center md:flex-row">
            <div className="mb-4 md:mb-0">
              <Link href="/signin">
                <button className="w-48 px-4 py-2 text-white rounded-md bg-brand-CTA-blue-500 hover:bg-brand-CTA-blue-600">
                  Signin
                </button>
              </Link>
            </div>
            <div className="ml-0 md:ml-4">
              <Link href="/signup">
                <button className="w-48 px-4 py-2 text-white rounded-md bg-brand-CTA-green-500 hover:bg-brand-CTA-green-600">
                  Create Account
                </button>
              </Link>
            </div>
          </div>
          <p className="mt-4 text-gray-500">
            Forgot your password?{' '}
            <Link
              href="/reset-password"
              className="text-blue-500 hover:underline"
            >
              Reset it here
            </Link>
            .
          </p>
        </div>
      </main>
    );
  }
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24">
      <h1 className="mb-8 text-4xl font-bold">Welcome, {me.name}!</h1>

      <div className="text-center">
        <p className="mb-4">You are signed in as {me.email}.</p>
        <Link href="/me/dashboard">
          <button className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">
            Go to Dashboard
          </button>
        </Link>{' '}
        <p className="mt-4 text-gray-500">
          Not {me.name}?{' '}
          <button
            onClick={handleSignout}
            className="text-blue-500 transition-colors duration-300 hover:text-blue-700 hover:underline"
            disabled={signoutMutation.isLoading}
          >
            {signoutMutation.isLoading ? (
              <div className="flex items-center justify-center text-blue-500">
                <Spinner />
              </div>
            ) : (
              'Signout'
            )}
          </button>
          .
        </p>
      </div>
    </main>
  );
}
