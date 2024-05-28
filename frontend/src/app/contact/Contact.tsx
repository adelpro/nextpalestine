'use client';

import messageSVG from '@/svgs/message.svg';
import Spinner from '@/components/spinner';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { isValidEmail } from '@/utils/isValidEmail';
import { useContact } from '@/hooks/useContact';
import Image from 'next/image';

export default function Contact() {
  const nameRef = useRef<HTMLInputElement>(null!);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [errors, setErrors] = useState<{
    name: string;
    email: string;
    message: string;
  }>({
    name: '',
    email: '',
    message: '',
  });
  const { contactMutation } = useContact();

  const validateFormInputs = ({
    name,
    email,
    message,
  }: {
    name: string;
    email: string;
    message: string;
  }) => {
    let errors: { name: string; email: string; message: string } = {
      name: '',
      email: '',
      message: '',
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
    if (!message) {
      errors.message = 'Message is required';
    }

    if (message?.length < 20) {
      errors.message = 'Message must be at least 20 characters';
    }
    return errors;
  };

  const handleContact = (e: FormEvent) => {
    e.preventDefault();
    setErrors({ name: '', email: '', message: '' });
    const validation = validateFormInputs({ name, email, message });
    if (validation.name || validation.email || validation.message) {
      setErrors({
        name: validation.name,
        email: validation.email,
        message: validation.message,
      });
      return null;
    }

    contactMutation.mutateAsync({ name, email, message });
  };
  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, []);

  return (
    <main className="flex flex-col items-center justify-between min-h-screen px-8 pt-24 md:px-24">
      <div className="flex flex-col items-center justify-center p-4 mx-auto border border-gray-300 rounded-md w-450 md:p-10">
        <h1 className="mb-4 text-2xl font-bold">Contact Us</h1>
        <div className="flex flex-col items-center justify-center md:flex-row">
          <form onSubmit={handleContact}>
            <div className="mb-4">
              <label htmlFor="name" className="font-semibold">
                Name
              </label>
              <input
                ref={nameRef}
                type="name"
                id="name"
                aria-label="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: '' }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                aria-label="email"
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
              <label htmlFor="message" className="font-semibold">
                Message
              </label>
              <textarea
                rows={5}
                cols={30}
                placeholder="Write your message here..."
                required
                aria-label="message"
                id="message"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setErrors((prev) => ({ ...prev, message: '' }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.message && (
                <p className="mt-2 text-sm text-red-500">{errors.message}</p>
              )}
            </div>

            <div className="flex flex-col items-center justify-center">
              <button
                disabled={contactMutation.isLoading}
                type="submit"
                className="inline-block w-full px-4 py-2 font-medium text-white rounded-md bg-brand-CTA-blue-500 hover:bg-brand-CTA-blue-600"
              >
                {contactMutation.isLoading ? (
                  <div className="flex items-center justify-center text-white">
                    <Spinner />
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Send Message</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
