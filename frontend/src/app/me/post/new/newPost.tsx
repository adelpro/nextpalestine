'use client';
import { editorConfig } from '@/components/editor/editorConfig';
import Editor from '@/components/editor/editor';

export default function NewPost() {
  return (
    <article className="max-w-2xl p-2 mx-auto bg-white shadow-md">
      <div className="container flex flex-col w-full">
        <Editor config={editorConfig} editable />
      </div>
    </article>
  );
}
