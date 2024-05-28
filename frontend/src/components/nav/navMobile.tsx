'use client';

import { useState } from 'react';

import NavProfile from './navProfile';
import NavButton from './navButton';
import NavLink from './navLink';

export default function NavMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = (): void => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="relative flex items-center ml-auto mr-2 md:hidden">
      <NavButton isOpen={isOpen} handleClick={toggleDropdown} />
      <nav
        id="menuNav"
        className={`${
          isOpen
            ? 'flex justify-center items-center text-5xl animate-slide-in fixed right-0 top-0 z-10 h-screen w-screen origin-right flex-col bg-white dark:bg-zinc-800 my-auto'
            : 'hidden'
        }`}
      >
        <div className="flex flex-col items-center justify-center mt-4 space-y-4 text-xl">
          <div id="profile-container">
            <NavProfile closeNavMenu={toggleDropdown} />
          </div>
          <NavLink href="/" onClick={toggleDropdown}>
            Home
          </NavLink>
          <NavLink href="/about" onClick={toggleDropdown}>
            About
          </NavLink>
          <NavLink href="/contact" onClick={toggleDropdown}>
            Contact
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
