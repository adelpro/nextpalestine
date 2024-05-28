import Image from 'next/image';
import Link from 'next/link';

import failSVG from '@/svgs/fail.svg';

type Props = {
  title: string;
  content: string;
};
export const ErrorCard = ({ title, content }: Props): React.ReactElement => {
  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="mx-auto max-w-md rounded-lg bg-white px-10 py-8 text-center shadow-lg">
        <Image
          src={failSVG}
          alt="Error"
          className="m-auto"
          width={200}
          height={200}
        />
        <h1 className="mb-5 text-3xl font-bold">{title}</h1>
        <p className="mb-8 text-xl">{content}</p>
        <Link
          href="/"
          className="w-full inline-block px-4 py-2 font-medium text-white bg-brand-CTA-blue-500 rounded-md hover:bg-brand-CTA-blue-600"
        >
          Return to the Home page
        </Link>
      </div>
    </div>
  );
};
