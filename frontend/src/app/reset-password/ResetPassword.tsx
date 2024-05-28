'use client';

import Image from 'next/image';

import useResetPassword from '@/hooks/useResetPassword';
import resetPasswordSVG from '@/svgs/resetPassword.svg';
import { isValidEmail } from '@/utils/isValidEmail';
import Spinner from '@/components/spinner';
import { useState } from 'react';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email: string }>({ email: '' });
  const { sendResetPasswordEmailMutation } = useResetPassword();
  const { isLoading } = sendResetPasswordEmailMutation;

  const validateEmailInput = (email: string): { email: string } => {
    let errors: { email: string } = {
      email: '',
    };
    if (!email) {
      errors.email = 'Email is required';
    }
    if (email && !isValidEmail(email)) {
      errors.email = 'Email is not valid';
    }
    return errors;
  };

  const handleSendResetPasswordEmail = async () => {
    setErrors({ email: '' });
    const validation = validateEmailInput(email);
    if (validation.email) {
      setErrors({ email: validation.email });
      return null;
    }
    await sendResetPasswordEmailMutation.mutateAsync({ email });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-8 pt-24 md:px-24">
      <div className="w-450 mx-auto flex flex-col items-center justify-center rounded-md border border-gray-300 p-4 md:p-10">
        <h2 className="mt-4 text-2xl font-bold">Reset Password</h2>
        <Image
          src={resetPasswordSVG}
          alt="Reset Password"
          width={200}
          height={200}
          className="mx-auto"
        />
        <div className="mt-4">
          <label htmlFor="email" className="mb-2 block text-left text-gray-600">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        <div className="mt-6 w-full">
          <button
            type="button"
            onClick={handleSendResetPasswordEmail}
            disabled={isLoading}
            className="inline-block w-full rounded-md bg-brand-CTA-blue-500 px-4 py-2 font-medium text-white hover:bg-brand-CTA-blue-600"
          >
            {isLoading ? (
              <div className="flex items-center justify-center text-white">
                <Spinner />
              </div>
            ) : (
              'Send Reset Password Email'
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
