'use client';
import { notFound, useParams, useRouter } from 'next/navigation';
import { editorConfig } from '@/components/editor/editorConfig';

import Editor from '@/components/editor/editor';
import Skeleton from '@/components/skeleton';
import UseMePost from '@/hooks/useMePost';

import Spinner from '@/components/spinner';
import React from 'react';

export default function ShowPost() {
  const params = useParams();
  const { id } = Array.isArray(params) ? params[0] : params;
  const { mePost: post, isLoadingMePost, deleteMePostMutation } = UseMePost();
  const router = useRouter();

  if (isLoadingMePost) {
    return <Skeleton />;
  }
  if (!id) {
    return notFound();
  }
  if (!post) {
    return notFound();
  }

  return (
    <article className="max-w-2xl p-8 mx-auto my-10 bg-white shadow-md">
      <Editor config={editorConfig} post={post} />
      <div className="flex mx-2 my-4">
        <button
          className="w-full max-w-md px-4 py-2 mr-2 text-white bg-blue-500 rounded hover:bg-blue-700"
          onClick={() => router.push(`/me/post/${post._id}/edit`)}
        >
          Edit
        </button>
        <button
          className="w-full max-w-md px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700"
          // TODO check for delete permission in the backend by cheching if the id of the post is in the user's posts
          onClick={() => deleteMePostMutation.mutateAsync(id)}
        >
          {deleteMePostMutation.isLoading ? (
            <div className="flex items-center justify-center text-white">
              <Spinner />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>Delete</span>
            </div>
          )}
        </button>
      </div>
    </article>
  );
}
