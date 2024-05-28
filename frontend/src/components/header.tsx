'use server';
import { Link } from 'next-view-transitions';
import NavMobile from './nav/navMobile';
import logo from '@/svgs/appLogo.svg';
import NavLarge from './nav/navLarge';
import Image from 'next/image';
import React from 'react';

export default async function Header() {
  return (
    <header className="container flex items-center justify-between max-w-screen-xl p-1 mx-auto my-5">
      <div>
        <Link href="/" className="hover:underline">
          <span className="sr-only">Home</span>
          <Image alt="Auth-roles" src={logo} width={60} height={60} />
        </Link>
      </div>
      <div>
        <NavLarge />
        <NavMobile />
      </div>
    </header>
  );
}
