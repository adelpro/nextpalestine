'use client';

import Image from 'next/image';

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import useProfileImage from '@/hooks/useProfileImage';
import useUpdatProfile from '@/hooks/useUpdatProfile';
import { isValidEmail } from '@/utils/isValidEmail';
import Spinner from '@/components/spinner';
import UseMe from '@/hooks/useMe';

export default function UpdateProfile() {
  type ErrorsType = {
    name: string;
    email: string;
    about: string;
  };
  const { me } = UseMe();
  const { profileImage, updateProfileImageMutation } = useProfileImage();
  const [imageData, setImageData] = useState<{
    preview: string | undefined;
    file: File | undefined;
  }>({
    preview: profileImage,
    file: undefined,
  });
  const nameRef = useRef<HTMLInputElement>(null!);
  const [name, setName] = useState<string>(me?.name || '');
  const [email, setEmail] = useState<string>(me?.email || '');
  const [about, setAbout] = useState<string>(me?.about || '');
  const [errors, setErrors] = useState<ErrorsType>({
    name: '',
    email: '',
    about: '',
  });
  const { updateProfileMutation } = useUpdatProfile();

  const validateFormInputs = (
    name: string,
    email: string,
    about: string,
  ): ErrorsType => {
    let errors: ErrorsType = {
      name: '',
      email: '',
      about: '',
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
    if (!about || about.length < 10 || about.length > 500) {
      errors.about =
        'About must be at least 10 characters and at most 500 characters long';
    }
    return errors;
  };

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({ name: '', email: '', about: '' });
    const validation = validateFormInputs(name, email, about);
    if (validation.name || validation.email) {
      setErrors(validation);
      setErrors({
        name: validation.name,
        email: validation.email,
        about: validation.about,
      });
      return null;
    }
    updateProfileMutation.mutateAsync({ name, email, about });
    if (imageData?.file) {
      await updateProfileImageMutation.mutateAsync({ image: imageData.file });
    }
  };
  const handleInputImageOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData({ preview: reader.result as string, file: image });
      };
      reader.readAsDataURL(image);
    }
  };
  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus();
    }
  }, []);

  return (
    <main className="flex flex-col items-center justify-between min-h-screen px-8 pt-24 md:px-24">
      <div className="flex flex-col items-center justify-center p-4 mx-auto border border-gray-300 rounded-md w-450 md:p-10">
        <h1 className="mb-4 text-2xl font-bold">Update profile</h1>
        <div className="flex flex-col md:flex-row">
          <div className="m-5">
            {imageData?.preview ? (
              <div className="flex items-center justify-center m-2 mx-auto overflow-hidden border-2 border-gray-400 rounded shadow-sm w-60 h-60">
                <Image
                  loading="lazy"
                  src={imageData?.preview}
                  alt="preview"
                  width={200}
                  height={200}
                  className="object-cover p-2 w-60 h-60"
                />
              </div>
            ) : profileImage ? (
              <div className="flex items-center justify-center m-2 mx-auto overflow-hidden border-2 border-gray-400 rounded shadow-sm w-60 h-60">
                <Image
                  loading="lazy"
                  src={profileImage}
                  alt="profile image"
                  width={200}
                  height={200}
                  className="object-cover p-2 w-60 h-60"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center m-4 mx-auto border-2 border-gray-400 rounded shadow-sm w-60 h-60"></div>
            )}
            <label
              htmlFor="image"
              className="block p-2 my-4 border-2 border-gray-600 border-dashed cursor-pointer"
            >
              Choose an image
            </label>
            <input
              type="file"
              id="image"
              accept="image/jpeg, image/jpg, image/png, image/webp"
              onChange={handleInputImageOnChange}
              className="hidden w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <form
            onSubmit={handleUpdateProfile}
            className="flex flex-col items-center justify-center mb-4 md:m5"
          >
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
                type="text"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: '' }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-500">{errors.email}</p>
            )}

            <div className="mb-4">
              <label htmlFor="bio" className="font-semibold">
                About
              </label>
              <textarea
                id="bio"
                value={about || ''}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.about && (
                <p className="mt-2 text-sm text-red-500">{errors.about}</p>
              )}
            </div>
          </form>
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          <button
            disabled={updateProfileMutation.isLoading}
            type="submit"
            onClick={handleUpdateProfile}
            className="inline-block w-full max-w-md px-4 py-2 font-medium text-white rounded-md bg-brand-CTA-blue-500 hover:bg-brand-CTA-blue-600"
          >
            {updateProfileMutation.isLoading ? (
              <div className="flex items-center justify-center text-white">
                <Spinner />
              </div>
            ) : (
              'Update profile'
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
