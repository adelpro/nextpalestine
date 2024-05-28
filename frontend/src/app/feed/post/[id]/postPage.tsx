import PreviewRenderer from '@/components/editor/previewer';
import DateFormatter from '@/components/dateFormatter';
import { POST } from '@/utils/types';
import React from 'react';

type Props = {
  post: POST;
};
export default function postPage({ post }: Props) {
  //const html = EditorJsToHtml.parse(post) as ParsedContent[];
  return (
    <article>
      <h1>{post.title}</h1>
      <DateFormatter dateString={post.publishedAt} />
      <DateFormatter dateString={post.updatedAt} />
      <PreviewRenderer data={post.content} />
    </article>
  );
}
