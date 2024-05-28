import axiosClient from '@/utils/axios';
import { POST } from '@/utils/types';
import { Metadata } from 'next';
import React from 'react';

/*
 * Calling request multiple times in Nextjs (in generateMetadata and getServerSideProps) will not lead
 * to multiple requests to the server.
 * https://stackoverflow.com/questions/76544280/set-metadata-dynamically-without-duplicate-requests-nextjs-13
 */

const fetchPost = async (id: string): Promise<POST> => {
  const response = await axiosClient.get(`/posts/${id}`);
  const post = response.data;
  return post;
};
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const paramId = params?.id;

  // Accept only one id value ( first param only)
  const id = Array.isArray(paramId) ? paramId[0] : paramId;
  const post = await fetchPost(id);
  const title = process.env.NEXT_PUBLIC_APP_NAME + ' | ' + post.title;
  const description = post.excerpt;

  return {
    title,
    description,
  };
}
/* const getserverSideProps = async ({ params }: { params: { id: string } }) => {
  const paramId = params?.id;

  // Accept only one id value ( first param only)
  const id = Array.isArray(paramId) ? paramId[0] : paramId;
  const post = await fetchPost(id);
  return {
    props: {
      post,
    },
  };
}; */
type Props = {
  post: POST;
};
export default function PostPage({ post }: Props) {
  return <PostPage post={post} />;
}
