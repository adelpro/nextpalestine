import DateFormatter from '@/components/dateFormatter';
import { getFirstImage } from '@/utils/getFirslImage';
import UseMePosts from '@/hooks/useMePosts';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function MeAllPosts() {
  const router = useRouter();
  const { mePosts } = UseMePosts();
  if (!mePosts?.length) {
    return (
      <div className="flex items-center justify-center">
        <p>No posts yet</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 p-2 m-2 mt-12 sm:m-4 sm:grid-cols-2 lg:grid-cols-3">
      {mePosts.map((post) => {
        const firstImage = getFirstImage(post?.content);
        return (
          <Link key={post._id} href={`/me/post/${post._id}`}>
            <div className="container flex flex-col justify-end overflow-hidden transition-all duration-300 bg-white rounded-lg shadow-md cursor-pointer dark:bg-gray-950 hover:scale-[1.01] hover:shadow-lg hover:border hover:border-brand-CTA-blue-500">
              {firstImage?.src ? (
                <Image
                  src={firstImage?.src}
                  alt="post image"
                  width={300}
                  height={300}
                  className="object-cover w-full rounded-t h-60"
                  placeholder={firstImage.placeholder ? 'blur' : 'empty'}
                  blurDataURL={firstImage?.placeholder}
                />
              ) : (
                <div className="object-cover w-full bg-gray-200 rounded-t h-60" />
              )}
              <h3 className="m-2 text-lg font-semibold underline capitalize">
                {post.title}
              </h3>
              <h5 className="m-2 text-sm text-gray-600 normal-case">
                {post.excerpt}
              </h5>
              <DateFormatter dateString={post.updatedAt} />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
