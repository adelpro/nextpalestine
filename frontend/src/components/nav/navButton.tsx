import { cn } from '@/utils/cn';
import React from 'react';

type Props = {
  isOpen: boolean;
  handleClick: () => void;
};
const genericHamburgerLine =
  'h-1 my-1 rounded-full bg-black transition ease transform duration-300 opacity-50 group-hover:opacity-100 w-full dark:bg-gray-100';

export default function NavButton({ isOpen, handleClick }: Props) {
  return (
    <button
      aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
      aria-controls="menuNav"
      aria-expanded={isOpen}
      title={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
      aria-haspopup="true"
      type="button"
      id="openIcon"
      className="z-20 flex flex-col items-center justify-center w-12 h-12 group"
      onClick={handleClick}
    >
      <div
        className={cn(genericHamburgerLine, {
          'rotate-45 translate-y-3': isOpen,
        })}
      />
      <div
        className={cn(genericHamburgerLine, {
          'opacity-0 group-hover:opacity-0': isOpen,
        })}
      />
      <div
        className={cn(genericHamburgerLine, {
          '-rotate-45 -translate-y-3': isOpen,
        })}
      />
    </button>
  );
}
