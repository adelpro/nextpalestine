'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';

import PasswordRequirements from '@/components/passwordRequirements';
import useResetPassword from '@/hooks/useResetPassword';
import hidePasswordSVG from '@/svgs/hidePassword.svg';
import showPasswordSVG from '@/svgs/showPassword.svg';
import { useEffect, useRef, useState } from 'react';
import Spinner from '@/components/spinner';

export default function AccountResetPasswordToken() {
  const params = useParams();
  const [password, setPassword] = useState<string>('');
  const passwordRef = useRef<HTMLInputElement>(null!);
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordType, setPasswordType] = useState<string>('password');
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });
  const { resetPasswordMutation } = useResetPassword();
  const { isLoading } = resetPasswordMutation;

  const validateInputs = (password: string, confirmPassword: string) => {
    let errors = {
      password: '',
      confirmPassword: '',
    };
    if (!password) {
      errors.password = 'Password is required';
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
  };

  const handleResetPassword = async () => {
    setErrors({ password: '', confirmPassword: '' });
    const validation = validateInputs(password, confirmPassword);
    if (validation.password || validation.confirmPassword) {
      setErrors({
        password: validation.password,
        confirmPassword: validation.confirmPassword,
      });
      return null;
    }
    // Accept only one token value ( first param only)
    const token = Array.isArray(params) ? params[0].token : params.token;
    resetPasswordMutation.mutateAsync({ token, password });
  };

  useEffect(() => {
    if (passwordRef.current) {
      passwordRef.current.focus();
    }
  }, []);

  return (
    <main className="flex flex-col items-center justify-between min-h-screen px-8 pt-24 md:px-24">
      <div className="flex flex-col items-center justify-center p-4 mx-auto border border-gray-300 rounded-md w-450 md:p-10">
        <h1 className="mb-8 text-4xl font-bold text-center">
          Reset Your password
        </h1>
        <p className="mb-4 text-center">
          Click the button below to reset your password:
        </p>
        <div className="mb-4">
          <label htmlFor="password" className="font-semibold">
            New password
          </label>
          <div className="relative flex-grow">
            <input
              id="password"
              ref={passwordRef}
              type={passwordType}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: '' }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              type="button"
              onClick={() =>
                setPasswordType((prev) =>
                  prev === 'password' ? 'text' : 'password',
                )
              }
              className="absolute transform -translate-y-1/2 right-3 top-1/2"
            >
              {passwordType === 'password' ? (
                <Image src={hidePasswordSVG} alt="Hide" />
              ) : (
                <Image src={showPasswordSVG} alt="Show" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-500">{errors.password}</p>
          )}
          <PasswordRequirements password={password} />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="font-semibold ">
            Confirm Password
          </label>
          <div className="relative flex-grow">
            <input
              id="confirmPassword"
              type={passwordType}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((prev) => ({ ...prev, confirmPassword: '' }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              type="button"
              onClick={() =>
                setPasswordType((prev) =>
                  prev === 'password' ? 'text' : 'password',
                )
              }
              className="absolute transform -translate-y-1/2 right-3 top-1/2"
            >
              {passwordType === 'password' ? (
                <Image src={hidePasswordSVG} alt="Hide" />
              ) : (
                <Image src={showPasswordSVG} alt="Show" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-500">
              {errors.confirmPassword}
            </p>
          )}
        </div>
        <div className="flex flex-col items-center justify-center">
          <button
            onClick={() => handleResetPassword()}
            className="inline-block w-48 px-4 py-2 font-medium text-white rounded-md bg-brand-CTA-blue-500 hover:bg-brand-CTA-blue-600"
          >
            {isLoading ? (
              <div className="flex items-center justify-center w-full text-white">
                <Spinner />
              </div>
            ) : (
              'Reset password'
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
