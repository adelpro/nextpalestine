'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';

import useActivateMyAccount from '@/hooks/useActivateMyAccount';
import accountActivationSVG from '@/svgs/accountActivation.svg';
import Spinner from '@/components/spinner';

export default function AccountActivationToken() {
  const params = useParams();
  const { activateMyAccountMutation } = useActivateMyAccount();
  const { isLoading } = activateMyAccountMutation;
  const handleActivation = async (): Promise<void> => {
    // Accept only one token value ( first param only)
    const token = Array.isArray(params) ? params[0] : params;
    activateMyAccountMutation.mutateAsync(token);
  };
  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <h1 className="mb-6 text-center text-3xl font-bold">
          Account activation
        </h1>
        <Image
          src={accountActivationSVG}
          alt="Success"
          width={200}
          height={200}
          className="mx-auto"
        />

        <p className="mb-4 mt-4 p-2 text-center text-gray-600">
          Click the button below to activate your account:
        </p>
        <div className="flex flex-col items-center justify-center">
          <button
            onClick={handleActivation}
            className="w-full inline-block px-4 py-2 font-medium text-white bg-brand-CTA-blue-500 rounded-md hover:bg-brand-CTA-blue-600"
          >
            {isLoading ? (
              <div className="flex items-center justify-center text-blue-500">
                <Spinner />
              </div>
            ) : (
              'Activate Account'
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
