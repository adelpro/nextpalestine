import Image from 'next/image';

import Spinner from '@/components/spinner';
import MaskedInput from 'react-text-mask';
import useTwoFA from '@/hooks/useTwoFA';
import React, { useState } from 'react';

export default function EnableTwoFA() {
  const [TOTP, setTOTP] = useState<string>('');
  const [errors, setErrors] = useState({ TOTP: '' });
  const { QRCode, verifyTwoFAMutation } = useTwoFA();
  const { isLoading } = verifyTwoFAMutation;
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

  const handleEnableTwoFA = async () => {
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
        <h1 className="mb-8 text-4xl font-bold text-center">Enable 2FA</h1>
        <div className="mb-4">
          <p className="mb-4 text-center">
            Make sure you have an authenticator app like Google Authenticator
            installed. Open the app, click &quot;Add Account&quot; and scan the
            QR code
          </p>
        </div>
        <div className="mb-4">
          <h1 className="font-semibold"> TOTP </h1>
          {!!QRCode ? (
            <Image
              src={QRCode}
              alt="QRCode"
              width={200}
              height={200}
              className="mx-auto"
            />
          ) : null}
        </div>
        <div className="relative flex flex-col items-center justify-center flex-grow">
          <label htmlFor="TOTP" className="mb-4 text-center">
            Then enter the 6-digit TOTP code to enable it
          </label>
          <MaskedInput
            id="TOTP"
            mask={[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
            placeholder="------"
            inputMode="numeric"
            // autoFocus
            value={TOTP}
            onChange={(e) => {
              handleTOTPChange(e.target.value);
            }}
            className="px-3 py-2 mx-auto text-center border border-gray-300 rounded-md w-52"
          />
          <div className="flex flex-col items-center justify-center w-full">
            <button
              type="button"
              onClick={handleEnableTwoFA}
              aria-label="Enable 2FA"
              title="Enable 2FA"
              disabled={isLoading}
              className="inline-block w-full px-4 py-2 m-5 font-medium text-white rounded-md bg-brand-CTA-blue-500 hover:bg-brand-CTA-blue-600"
            >
              {isLoading ? (
                <div className="flex items-center justify-center text-blue-500">
                  <Spinner />
                </div>
              ) : (
                'Enable 2FA'
              )}
            </button>
          </div>
          {errors.TOTP && (
            <p className="mt-2 text-sm text-red-500">{errors.TOTP}</p>
          )}
        </div>
      </div>
    </main>
  );
}
