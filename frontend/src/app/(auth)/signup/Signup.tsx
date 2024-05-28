'use client';

import Image from 'next/image';
import Link from 'next/link';

import PasswordRequirements from '@/components/passwordRequirements';
import { FormEvent, useEffect, useRef, useState } from 'react';
import hidePasswordSVG from '@/svgs/hidePassword.svg';
import showPasswordSVG from '@/svgs/showPassword.svg';
import { isValidEmail } from '@/utils/isValidEmail';
import { useSignup } from '@/hooks/useSignup';
import Spinner from '@/components/spinner';

export default function Signup() {
  type ErrorsType = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  const [passwordType, setPasswordType] = useState<string>('password');
  const nameRef = useRef<HTMLInputElement>(null!);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<ErrorsType>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { signupMutation } = useSignup();

  const validateFormInputs = (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ): ErrorsType => {
    let errors: ErrorsType = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    if (!name) {
      errors.name = 'Name is required';
    }
    if (!email) {
      errors.email = 'Email is required';
    }
    if (email && !isValidEmail(email)) {
      errors.email = 'Email is not valid';
    }
    if (!password) {
      errors.password = 'Password is required';
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
  };

  const handleSignup = (e: FormEvent) => {
    e.preventDefault();
    setErrors({ name: '', email: '', password: '', confirmPassword: '' });
    const validation = validateFormInputs(
      name,
      email,
      password,
      confirmPassword,
    );
    if (
      validation.name ||
      validation.email ||
      validation.password ||
      validation.confirmPassword
    ) {
      setErrors(validation);
      setErrors({
        name: validation.name,
        email: validation.email,
        password: validation.password,
        confirmPassword: validation.confirmPassword,
      });
      return null;
    }
    signupMutation.mutateAsync({ name, email, password });
  };

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-8 pt-24 md:px-24">
      <div className="w-450 mx-auto flex flex-col items-center justify-center rounded-md border border-gray-300 p-4 md:p-10">
        <h1 className="mb-4 text-2xl font-bold">Sign Up</h1>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label htmlFor="name" className="font-semibold">
              Name
            </label>
            <input
              ref={nameRef}
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: '' }));
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: '' }));
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-500">{errors.email}</p>
            )}
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
            <label htmlFor="confirmPassword" className="font-semibold">
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
          <div className="flex flex-col items-center justify-center">
            <button
              disabled={signupMutation.isLoading}
              type="submit"
              className="inline-block w-full rounded-md bg-brand-CTA-blue-500 px-4 py-2 font-medium text-white hover:bg-brand-CTA-blue-600"
            >
              {signupMutation.isLoading ? (
                <div className="flex items-center justify-center text-white">
                  <Spinner />
                </div>
              ) : (
                'Sign Up'
              )}
            </button>
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <p className="mt-4 text-sm  text-gray-500">
              You already have an account?{' '}
              <Link href="/signin" className="text-blue-500 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
