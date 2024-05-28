'use client';

import Image from 'next/image';

import useActivateMyAccount from '@/hooks/useActivateMyAccount';
import Spinner from '@/components/spinner';
import failSVG from '@/svgs/fail.svg';

export default function AccountActivation() {
  const { sendActivationEmailMutation } = useActivateMyAccount();
  const { isLoading } = sendActivationEmailMutation;
  const handleSendActivationEmail = () => {
    sendActivationEmailMutation.mutateAsync();
  };
  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <h2 className="mt-4 text-2xl font-bold">Account Activation Failed</h2>
        <Image
          src={failSVG}
          alt="Fail"
          width={200}
          height={200}
          className="mx-auto"
        />
        <p className="mt-4 text-gray-600">
          We&apos;re sorry, but it seems that your account activation is
          pending. An activation link will be send to your. Please check your
          inbox, including the spam folder, for the activation email.
        </p>
        <div className="flex flex-col justify-center items-center">
          <button
            type="button"
            onClick={handleSendActivationEmail}
            disabled={isLoading}
            className="w-full inline-block px-4 py-2 font-medium text-white bg-brand-CTA-blue-500 rounded-md hover:bg-brand-CTA-blue-600"
          >
            {isLoading ? (
              <div className="text-blue-500 flex justify-center items-center">
                <Spinner />
              </div>
            ) : (
              'Send Activation Email'
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
