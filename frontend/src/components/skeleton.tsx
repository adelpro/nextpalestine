import Image from 'next/image';

import imagePlaceHolderSVG from '@/svgs/imagePlaceHolder.svg';

export default function Skeleton() {
  return (
    <div
      role="status"
      className="w-full max-w-md p-4 m-auto border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700"
    >
      <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
        <div className="w-10 h-10 text-gray-200 dark:text-gray-600">
          <Image
            src={imagePlaceHolderSVG}
            alt="image place holder"
            width={200}
            height={200}
            className="mx-auto"
          />
        </div>
      </div>
      <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
    </div>
  );
}
