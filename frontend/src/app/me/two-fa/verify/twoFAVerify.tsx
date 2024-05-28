'use client';

import Image from 'next/image';

import Spinner from '@/components/spinner';
import MaskedInput from 'react-text-mask';
import useTwoFA from '@/hooks/useTwoFA';
import twofaSVG from '@/svgs/twofa.svg';
import { useState } from 'react';

export default function TwoFAVerify() {
  const [TOTP, setTOTP] = useState<string>('');
  const [errors, setErrors] = useState({ TOTP: '' });
  const { verifyTwoFAMutation, sendTwoFAMailMutation } = useTwoFA();

  const validateInputs = (TOTP: string) => {
    let errors = { TOTP: '' };
    if (!TOTP) {
      errors.TOTP = 'TOTP is required';
    }
    const sanitizedValue = TOTP.replace(/[^0-9]/g, '').slice(0, 6);
    if (TOTP !== sanitizedValue) {
      errors.TOTP = 'TOTP must be a 6-digit number';
    }

    return errors;
  };
  const handleVerifyTwoFA = async () => {
    setErrors({ TOTP: '' });
    const validation = validateInputs(TOTP);
    if (validation.TOTP) {
      setErrors({
        TOTP: validation.TOTP,
      });
      return null;
    }
    await verifyTwoFAMutation.mutateAsync({ TOTP });
  };

  const handleTOTPChange = (value: string) => {
    setTOTP(value);
    setErrors((prev) => ({ ...prev, TOTP: '' }));
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-6 text-center bg-white rounded-lg shadow-lg">
        <h2 className="mt-4 text-2xl font-bold">Verify 2FA</h2>
        <Image
          src={twofaSVG}
          alt="Reset Password"
          width={200}
          height={200}
          className="mx-auto"
        />
        <div className="flex flex-col items-center justify-center mt-4">
          <label htmlFor="TOTP" className="mb-4 text-center">
            Then enter the 6-digit TOTP code to enable it
          </label>
          <MaskedInput
            id="TOTP"
            mask={[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
            placeholder="------"
            inputMode="numeric"
            // FIXME autoFocus
            value={TOTP}
            onChange={(e) => {
              handleTOTPChange(e.target.value);
            }}
            className="px-3 py-2 mx-auto text-center border border-gray-300 rounded-md w-52"
          />
          {errors.TOTP && (
            <p className="mt-2 text-sm text-red-500">{errors.TOTP}</p>
          )}
        </div>
        <div className="w-full mt-6">
          <button
            type="button"
            onClick={handleVerifyTwoFA}
            disabled={verifyTwoFAMutation.isLoading}
            aria-label="Verify 2FA"
            className="inline-block w-full px-4 py-2 font-medium text-white rounded-md bg-brand-CTA-blue-500 hover:bg-brand-CTA-blue-600"
          >
            {verifyTwoFAMutation.isLoading ? (
              <div className="flex items-center justify-center text-white">
                <Spinner />
              </div>
            ) : (
              'Verify 2FA'
            )}
          </button>
        </div>
        <div className="w-full mt-6">
          <p className="text-center text-gray-700">
            can&apos;t access your authenticator app?
            <button
              className="text-blue-500 hover:underline"
              disabled={sendTwoFAMailMutation.isLoading}
              aria-label="Get code via email"
              onClick={() => {
                sendTwoFAMailMutation.mutateAsync();
              }}
            >
              Get code via email
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
