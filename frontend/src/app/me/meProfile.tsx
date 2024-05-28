'use client';

import Image from 'next/image';

import useProfileImage from '@/hooks/useProfileImage';
import UseMe from '@/hooks/useMe';

import { useRouter } from 'next/navigation';
import MeAllPosts from './meAllPosts';

export default function MeProfile() {
  const router = useRouter();
  const { me } = UseMe();
  const { profileImage } = useProfileImage();

  return (
    <div className="flex flex-col items-center justify-center">
      <div key="1" className="container px-4 py-12 mx-auto sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40">
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Avatar"
                className="object-cover w-full h-full rounded-full"
                height={160}
                style={{
                  aspectRatio: '160/160',
                  objectFit: 'cover',
                }}
                width={160}
              />
            ) : null}

            <div className="absolute right-0 px-2 py-1 text-xs text-white bg-gray-900 rounded-full bottom-1">
              {me?.role}
            </div>
          </div>
          <h1 className="text-3xl font-bold capitalize">{`${me?.name}`}</h1>
          <p className="text-gray-500 capitalize dark:text-gray-400">
            {me?.about}
          </p>
        </div>
      </div>

      <div className="w-full">
        <div className="flex items-center justify-center p-2 md:p-4">
          <button
            onClick={() => router.push('/me/post/new')}
            className="inline-block w-full max-w-md px-4 py-2 mx-auto my-3 font-medium text-white rounded-md bg-brand-CTA-blue-500 hover:bg-brand-CTA-blue-600"
          >
            Create New Post
          </button>
        </div>

        <MeAllPosts />
      </div>
    </div>
  );
}
