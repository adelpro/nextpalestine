'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import useProfileImage from '@/hooks/useProfileImage';
import React, { useState } from 'react';
import useMe from '@/hooks/useMe';
import UseMe from '@/hooks/useMe';

import DeleteUserModal from './deleteUserModal';
import Skeleton from './skeleton';
import Spinner from './spinner';

export default function Me() {
  const { me } = UseMe();
  const { profileImage } = useProfileImage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { deleteMeMutation } = useMe();
  const router = useRouter();
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const deleteMyAccount = () => {
    setIsModalOpen(false);
    deleteMeMutation.mutateAsync();
  };
  if (!me) {
    return <Skeleton />;
  }

  return (
    <main className="w-full max-lg:">
      <div className="p-4 bg-white rounded-lg shadow-xs">
        <h2 className="m-4 text-xl font-bold">User Information</h2>
        <div className="flex-row items-stretch justify-center w-full gap-3 md:flex-column md:flex">
          <div className="flex items-center justify-center p-4 mt-4 mb-4 bg-white rounded-lg shadow-md">
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Avatar"
                width={200}
                height={200}
                className="object-cover mx-auto"
              />
            ) : null}
          </div>
          <div className="flex flex-col justify-start gap-2 p-4 mt-4 mb-4 bg-white rounded-lg shadow-md">
            <p className="text-lg">
              <strong>ID: </strong>
              {me.id}
            </p>
            <p className="text-lg">
              <strong>Name: </strong>
              {me.name}
            </p>
            <p className="text-lg">
              <strong>Email: </strong>
              {me.email}
            </p>
            <p className="text-lg">
              <strong>Role: </strong>
              {me.role}
            </p>
            <p className="text-lg">
              <strong>About:</strong>
              {me.about}
            </p>
            <p className="text-lg">
              <strong>2FA status: </strong>
              {me.isTwoFAEnabled ? 'Enabled' : 'Disabled'} (
              <Link href="/me/two-fa" className="text-blue-500 hover:underline">
                Change
              </Link>
              )
            </p>

            <div className="text-lg">
              {me.isDeviceTrusted ? (
                <>
                  <strong>Trusted device: </strong>
                  <span role="img" aria-label="yes">
                    ✅
                  </span>
                </>
              ) : (
                <>
                  <strong>Trusted device: </strong>{' '}
                  <span role="img" aria-label="no">
                    ❌
                  </span>
                </>
              )}
            </div>
            <div className="flex-row items-center justify-center gap-1 mt-4 md:flex-column md:flex">
              <button
                onClick={() => router.push('/me/update-profile')}
                className="w-full px-4 py-2 m-1 text-blue-500 bg-white border-2 border-blue-500 rounded-xl hover:bg-blue-300 focus:outline-none md:w-48"
              >
                Update profile
              </button>
              <button
                onClick={() => router.push('/me/update-password')}
                className="w-full px-4 py-2 m-1 text-blue-500 bg-white border-2 border-blue-500 rounded-xl hover:bg-blue-300 focus:outline-none md:w-48"
              >
                Update password
              </button>
            </div>
          </div>
        </div>
        <h1 className="m-4 text-xl font-bold text-red-500">Danger zone</h1>
        <div className="flex-row items-stretch justify-center w-full gap-3 md:flex-column md:flex">
          <div className="flex flex-col justify-start w-full gap-2 p-4 mt-4 mb-4 bg-white rounded-lg shadow-md">
            <div className="flex flex-row items-center gap-2">
              <span className="text-lg font-semibold md:mr-4">
                Account Deletion:
              </span>
              <button
                onClick={handleOpenModal}
                disabled={deleteMeMutation.isLoading}
                className="flex items-center justify-center w-full px-4 py-2 font-bold text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none md:w-48"
              >
                {deleteMeMutation.isLoading ? (
                  <div className="flex items-center justify-center mr-2 text-white">
                    <Spinner />
                  </div>
                ) : (
                  <span>Delete my account</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <DeleteUserModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        text="Are you sure you want to permanently delete your account?"
        onConfirm={deleteMyAccount}
      />
    </main>
  );
}
