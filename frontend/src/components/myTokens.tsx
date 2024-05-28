'use client';

import Image from 'next/image';

import deleteItem from '@/svgs/deleteItem.svg';
import UseMyTokens from '@/hooks/useMeTokens';
import useSignout from '@/hooks/useSignout';
import { twMerge } from 'tailwind-merge';
import { Token } from '@/utils/types';

import SkeletonSimple from './skeletonSimple';
import Spinner from './spinner';

export default function MyTokens() {
  const { myTokens, CurrentTokenId, deleteTokenMutation, isLoadingMyTokens } =
    UseMyTokens();
  const { signoutMutation } = useSignout();
  if (isLoadingMyTokens) {
    return (
      <div className="bg-white shadow-md rounded-lg p-4 h-48">
        <h2 className="text-xl font-bold mb-4">Tokens</h2>
        <SkeletonSimple />
      </div>
    );
  }
  if (!myTokens?.length) {
    return (
      <div className="bg-white shadow-md rounded-lg p-4 h-48">
        <h2 className="text-xl font-bold mb-4">Tokens</h2>
        <p>No Tokens found!</p>
      </div>
    );
  }
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Tokens</h2>
      <ul className="flex justify-stretch items-stretch flex-wrap flex-shrink">
        {myTokens.map((token: Token) => (
          <li
            key={token.id}
            className={twMerge(
              'bg-gray-100 m-2 p-2 rounded flex justify-between items-center w-full md:w-1/2 lg:w-1/3',
              CurrentTokenId === token.id
                ? 'rounded bg-blue-200 border-2 border-blue-500 text-blue-500 hover:border-blue-600 hover:text-blue-600'
                : '',
            )}
          >
            <div>
              <p className="font-semibold">ID: {token.id}</p>
              <p className="text-gray-500">Label: {token.label}</p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => {
                  deleteTokenMutation.mutateAsync(token.id);
                  if (CurrentTokenId === token.id) {
                    signoutMutation.mutateAsync();
                  }
                }}
                disabled={deleteTokenMutation.isLoading}
                className="bg-transparent border-none cursor-pointer p-5 w-20 h-20"
              >
                {deleteTokenMutation.isLoading ? (
                  <Spinner />
                ) : (
                  <Image
                    src={deleteItem}
                    alt="delete"
                    width={100}
                    height={100}
                  />
                )}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
