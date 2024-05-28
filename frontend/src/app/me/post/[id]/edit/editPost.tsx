'use client';
import { editorConfig } from '@/components/editor/editorConfig';
import Editor from '@/components/editor/editor';
import Skeleton from '@/components/skeleton';
import { notFound } from 'next/navigation';
import UseMePost from '@/hooks/useMePost';

export default function EditPost() {
  const { mePost, isErrorMePost, isLoadingMePost } = UseMePost();

  if (isLoadingMePost) {
    return <Skeleton />;
  }

  if (isErrorMePost) {
    return notFound();
  }

  if (!mePost) {
    return notFound();
  }

  return (
    <article className="max-w-2xl p-2 mx-auto bg-white shadow-md">
      <div className="container flex flex-col w-full">
        <Editor config={editorConfig} post={mePost} editable />
      </div>
    </article>
  );
}
