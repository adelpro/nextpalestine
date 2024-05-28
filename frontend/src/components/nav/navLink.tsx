'use client';

import { usePathname } from 'next/navigation';
import { Link } from 'next-view-transitions';

interface Props {
  children: string;
  href: string;
  onClick?: () => void;
}
export default function NavLink({ children, onClick, href, ...rest }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${
        isActive
          ? 'mx-4  transform rounded bg-blue-500 text-gray-100 duration-200 ease-in-out hover:scale-110 hover:opacity-90 dark:bg-blue-200 dark:text-gray-500'
          : 'm-1 no-underline hover:underline'
      } flex items-center px-4 py-3 font-semibold leading-none`}
      {...rest}
    >
      {children}
    </Link>
  );
}
