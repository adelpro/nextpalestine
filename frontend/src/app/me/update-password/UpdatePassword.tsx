'use client';

import Image from 'next/image';

import PasswordRequirements from '@/components/passwordRequirements';
import useUpdatePassword from '@/hooks/useUpdatePassword';
import hidePasswordSVG from '@/svgs/hidePassword.svg';
import showPasswordSVG from '@/svgs/showPassword.svg';
import { useEffect, useRef, useState } from 'react';
import Spinner from '@/components/spinner';

export default function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState<string>('');
  const oldPasswordRef = useRef<HTMLInputElement>(null!);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordType, setPasswordType] = useState<string>('password');
  const [errors, setErrors] = useState({
    oldPassword: '',
    password: '',
    confirmPassword: '',
  });
  const { updatePasswordMutation } = useUpdatePassword();
  const validateInputs = (
    oldPassword: string,
    password: string,
    confirmPassword: string,
  ) => {
    let errors = {
      oldPassword: '',
      password: '',
      confirmPassword: '',
    };
    if (!oldPassword) {
      errors.oldPassword = 'Old password is required';
    }
    if (!password) {
      errors.password = 'Password is required';
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
  };

  const handleUpdatePassword = async () => {
    setErrors({ oldPassword: '', password: '', confirmPassword: '' });
    const validation = validateInputs(oldPassword, password, confirmPassword);
    if (
      validation.oldPassword ||
      validation.password ||
      validation.confirmPassword
    ) {
      setErrors({
        oldPassword: validation.oldPassword,
        password: validation.password,
        confirmPassword: validation.confirmPassword,
      });
      return null;
    }
    updatePasswordMutation.mutateAsync({ oldPassword, newPassword: password });
  };

  useEffect(() => {
    if (oldPasswordRef.current) {
      oldPasswordRef.current.focus();
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-8 pt-24 md:px-24">
      <div className="w-450 mx-auto flex flex-col items-center justify-center rounded-md border border-gray-300 p-4 md:p-10">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Update your password
        </h1>
        <p className="mb-4 text-center">
          Click the button below to update your password:
        </p>
        <div className="mb-4">
          <label htmlFor="password" className="font-semibold">
            Old password
          </label>
          <div className="relative flex-grow">
            <input
              id="password"
              ref={oldPasswordRef}
              type={passwordType}
              value={oldPassword}
              onChange={(e) => {
                setOldPassword(e.target.value);
                setErrors((prev) => ({ ...prev, oldPassword: '' }));
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
            <button
              type="button"
              onClick={() =>
                setPasswordType((prev) =>
                  prev === 'password' ? 'text' : 'password',
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 transform"
            >
              {passwordType === 'password' ? (
                <Image src={hidePasswordSVG} alt="Hide" />
              ) : (
                <Image src={showPasswordSVG} alt="Show" />
              )}
            </button>
          </div>
          {errors.oldPassword && (
            <p className="mt-2 text-sm text-red-500">{errors.oldPassword}</p>
          )}
          <PasswordRequirements password={oldPassword} />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="font-semibold">
            Password
          </label>
          <div className="relative flex-grow">
            <input
              id="password"
              type={passwordType}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: '' }));
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
            <button
              type="button"
              onClick={() =>
                setPasswordType((prev) =>
                  prev === 'password' ? 'text' : 'password',
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 transform"
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
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
            <button
              type="button"
              onClick={() =>
                setPasswordType((prev) =>
                  prev === 'password' ? 'text' : 'password',
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 transform"
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
        <div className="flex w-full flex-col items-center justify-center">
          <button
            onClick={() => handleUpdatePassword()}
            disabled={updatePasswordMutation.isLoading}
            className="inline-block w-full rounded-md bg-brand-CTA-blue-500 px-4 py-2 font-medium text-white hover:bg-brand-CTA-blue-600"
          >
            {updatePasswordMutation.isLoading ? (
              <div className="flex items-center justify-center text-blue-500">
                <Spinner />
              </div>
            ) : (
              'Update password'
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
