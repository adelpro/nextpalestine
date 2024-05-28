'use client';

import Image from 'next/image';
import Link from 'next/link';

import PasswordRequirements from '@/components/passwordRequirements';
import { checkPasswordRequirements } from '@/utils/isValidPassword';
import { FormEvent, useEffect, useRef, useState } from 'react';
import hidePasswordSVG from '@/svgs/hidePassword.svg';
import showPasswordSVG from '@/svgs/showPassword.svg';
import { isValidEmail } from '@/utils/isValidEmail';
import facebookSVG from '@/svgs/facebook.svg';
import { useSignIn } from '@/hooks/useSignin';
import Spinner from '@/components/spinner';
import githubSVG from '@/svgs/github.svg';
import googleSVG from '@/svgs/google.svg';

export default function Signin() {
  const [passwordType, setPasswordType] = useState<string>('password');
  const emailRef = useRef<HTMLInputElement>(null!);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ email: string; password: string }>({
    email: '',
    password: '',
  });
  const { signinMutation } = useSignIn();

  const validateFormInputs = (
    email: string,
    password: string,
  ): { email: string; password: string } => {
    let errors: { email: string; password: string } = {
      email: '',
      password: '',
    };
    if (!email) {
      errors.email = 'Email is required';
    }
    if (email && !isValidEmail(email)) {
      errors.email = 'Email is not valid';
    }
    if (!password) {
      errors.password = 'Password is required';
    }
    return errors;
  };

  const handleSingin = (e: FormEvent) => {
    e.preventDefault();
    setErrors({ email: '', password: '' });
    const validation = validateFormInputs(email, password);
    const passwordRequirements = checkPasswordRequirements(password);
    if (validation.email || validation.password) {
      setErrors({ email: validation.email, password: validation.password });
      return null;
    }
    if (!passwordRequirements.isValid) {
      return null;
    }
    signinMutation.mutateAsync({ email, password });
  };
  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);
  return (
    <main className="flex flex-col items-center justify-between min-h-screen px-8 pt-24 md:px-24">
      <div className="flex flex-col items-center justify-center p-4 mx-auto border border-gray-300 rounded-md w-450 md:p-10">
        <h1 className="mb-4 text-2xl font-bold">Signin</h1>
        <div className="flex flex-col items-center justify-center md:flex-row">
          <div className="w-full md:w-1/2">
            <div className="w-full">
              <button
                className="w-full px-4 py-2 my-2 font-semibold text-blue-600 border-2 rounded-md border-brand-CTA-blue-500 hover:border-brand-CTA-blue-600 focus:outline-none focus:shadow-outline"
                onClick={() => {
                  window.open(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/signin`,
                    '_self',
                  );
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <Image
                    src={googleSVG}
                    alt=" Signin with google"
                    width={30}
                    height={30}
                  />
                  Continue with Google
                </div>
              </button>
            </div>
            <div className="w-full">
              <button
                className="w-full px-4 py-2 my-2 font-semibold text-black border-2 border-black rounded-md hover:border-gray-600 hover:text-gray-600 focus:outline-none focus:shadow-outline"
                onClick={() => {
                  window.open(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/github/signin`,
                    '_self',
                  );
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <Image
                    src={githubSVG}
                    alt=" Signin with github"
                    width={30}
                    height={30}
                  />
                  Continue with Github
                </div>
              </button>
            </div>
            <div className="w-full">
              <button
                className="w-full px-4 py-2 font-semibold text-blue-600 border-2 rounded-md border-brand-CTA-blue-500 hover:border-brand-CTA-blue-600 focus:outline-none focus:shadow-outline"
                onClick={() => {
                  window.open(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/facebook/signin`,
                    '_self',
                  );
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <Image
                    src={facebookSVG}
                    alt=" Signin with Facebook"
                    width={30}
                    height={30}
                  />
                  Continue with Facebook
                </div>
              </button>
            </div>
          </div>
          <div className="relative flex items-center justify-center my-4">
            <div className="absolute right-0 h-px bg-gray-400 w-44 top-1/2 md:hidden" />
            <div className="absolute left-0 h-px bg-gray-400 w-44 top-1/2 md:hidden" />

            <div className="absolute top-0 hidden w-px h-32 bg-gray-400 right-1/2 md:block" />
            <div className="absolute bottom-0 hidden w-px h-32 bg-gray-400 right-1/2 md:block" />
            <span className="relative px-3 mx-3 text-gray-400 bg-white z-5">
              Or
            </span>
          </div>

          <form onSubmit={handleSingin}>
            <div className="mb-4">
              <label htmlFor="email" className="font-semibold">
                Email
              </label>
              <input
                ref={emailRef}
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: '' }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
            <div className="flex flex-col items-center justify-center">
              <button
                disabled={signinMutation.isLoading}
                type="submit"
                className="inline-block w-full px-4 py-2 font-medium text-white rounded-md bg-brand-CTA-blue-500 hover:bg-brand-CTA-blue-600"
              >
                {signinMutation.isLoading ? (
                  <div className="flex items-center justify-center text-white">
                    <Spinner />
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <p className="mt-4 text-sm text-gray-500">
                {`New to ${process.env.NEXT_PUBLIC_APP_NAME}? `}
                <Link href="/signup" className="text-blue-500 hover:underline">
                  Sign up
                </Link>{' '}
                or{' '}
                <Link
                  href={`/reset-password`}
                  className="text-blue-500 hover:underline"
                >
                  Reset password
                </Link>
                .
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
