import arrowDownSVG from '@/svgs/arrowDown-2.svg';
import arrowUpSVG from '@/svgs/arrowUp-2.svg';
import DateFormatter from '../dateFormatter';
import React, { useState } from 'react';
import { POST } from '@/utils/types';
import Image from 'next/image';

type Props = {
  post: POST;
  setEditPost: React.Dispatch<React.SetStateAction<POST>>;
  editable?: boolean;
};
export default function PostHeader({
  post,
  setEditPost,
  editable = false,
}: Props) {
  const [showForm, setShowForm] = useState<boolean>(false);

  if (!editable) {
    return (
      <>
        <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>
        <h3 className="mb-4 text-xl">{post.excerpt}</h3>
        <p className="mb-2">
          Published on: <DateFormatter dateString={post.publishedAt} />
        </p>
        <p className="mb-2">
          Updated on: <DateFormatter dateString={post.updatedAt} />
        </p>
      </>
    );
  }
  return (
    <>
      <div className="flex flex-col items-center justify-between px-2 border rounded-sm">
        <div className="flex items-center justify-between w-full my-2">
          <h3 className="text-xl font-bol">Post header</h3>
          <button
            aria-label={showForm ? 'Hide Form' : 'Show Form'}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? (
              <Image
                src={arrowDownSVG}
                alt="Fail"
                width={30}
                height={30}
                className="mx-auto"
              />
            ) : (
              <Image
                src={arrowUpSVG}
                alt="Fail"
                width={30}
                height={30}
                className="mx-auto"
              />
            )}
          </button>
        </div>
        {showForm ? (
          <form className="w-full max-w-md">
            <label className="block mb-2">
              <span className="text-gray-700">Title</span>
              <input
                type="text"
                alt="Title"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                value={post.title}
                onChange={(e) => {
                  setEditPost((prev) => ({ ...prev, title: e.target.value }));
                }}
              />
            </label>
            <label className="block mb-2">
              <span className="text-gray-700">Excerpt</span>
              <input
                type="text"
                alt="Excerpt"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                value={post.excerpt}
                onChange={(e) => {
                  setEditPost((prev) => ({ ...prev, excerpt: e.target.value }));
                }}
              />
            </label>

            <label className="flex items-center justify-start mb-2 ml-2">
              <input
                type="checkbox"
                alt="Publish"
                aria-readonly={!editable}
                className="border-gray-300 rounded-md shadow-sm placeholder:text-gray-400 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                checked={post.isPublished}
                onChange={(e) => {
                  setEditPost((prev) => ({
                    ...prev,
                    isPublished: e.target.checked,
                  }));
                }}
              />
              <span className="ml-2 text-gray-700">Publish</span>
            </label>
          </form>
        ) : null}
      </div>
    </>
  );
}
