import useTwoFA from '@/hooks/useTwoFA';
import React from 'react';

export default function DisableTwoFA() {
  const { disableTwoFAMutation } = useTwoFA();
  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="mb-4 text-center">
          <p className="mb-2 font-semibold">2FA is already enabled.</p>
          <button
            onClick={() => disableTwoFAMutation.mutateAsync()}
            disabled={disableTwoFAMutation.isLoading}
            className="mx-auto flex w-full items-center justify-center rounded-md bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600 focus:outline-none md:w-48"
          >
            Disable
          </button>
        </div>
      </div>
    </main>
  );
}
