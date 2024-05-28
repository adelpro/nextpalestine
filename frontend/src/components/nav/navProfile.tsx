'use client';

import useProfileImage from '@/hooks/useProfileImage';
import arrowDownSVG from '@/svgs/arrowDown.svg';
import { Link } from 'next-view-transitions';
import arrowUpSVG from '@/svgs/arrowUp.svg';
import { isSignedin } from '@/recoil/store';
import { useRecoilValue } from 'recoil';
import { useState } from 'react';
import Image from 'next/image';

import NavDropDown from './navDropDown';

interface Props {
  closeNavMenu?: () => void;
}
export default function NavProfile({ closeNavMenu = () => {} }: Props) {
  const { profileImage } = useProfileImage();
  const isSignedinValue = useRecoilValue(isSignedin);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };
  if (!isSignedinValue)
    return (
      <div className="flex flex-col items-center justify-center md:flex-row md:mr-4">
        <Link
          href="/signin"
          onClick={closeNavMenu}
          className="w-48 p-2 my-2 text-center border-2 rounded-md md:mr-4 md:w-20 border-brand-CTA-blue-500 text-brand-CTA-blue-500 hover:bg-brand-CTA-blue-600 hover:text-white"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          onClick={closeNavMenu}
          className="w-48 p-2 my-2 text-center border-2 rounded-md md:w-20 border-brand-CTA-green-500 text-brand-CTA-green-500 hover:bg-brand-CTA-green-600 hover:text-white"
        >
          Sign up
        </Link>
      </div>
    );

  if (profileImage) {
    return (
      <div className="bg-white rounded-full shadow-lg">
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="inline-flex items-center justify-center h-full px-2 text-gray-600 border-l border-gray-100 rounded-r-md hover:bg-gray-50 hover:text-gray-700"
          >
            <Image
              data-dropdown-toggle="userDropdown"
              data-dropdown-placement="bottom-start"
              className="object-cover w-12 h-12 rounded-full cursor-pointer md:h-12 md:w-12"
              src={profileImage}
              alt="Avatar"
              width={100}
              height={100}
            />
          </button>
          {isDropdownOpen ? (
            <>
              <Image
                id="avatarArrow"
                className="absolute bottom-0 right-0 w-5 mt-2 bg-white rounded-md shadow-lg"
                src={arrowUpSVG}
                height={30}
                width={30}
                alt="Arrow"
              />
              <NavDropDown
                setIsDropdownOpen={setIsDropdownOpen}
                closeNavMenu={closeNavMenu}
              />
            </>
          ) : (
            <Image
              id="avatarArrow"
              className="absolute bottom-0 right-0 w-5 mt-2 bg-white rounded-md shadow-lg"
              src={arrowDownSVG}
              height={30}
              width={30}
              alt="Arrow"
            />
          )}
        </div>
      </div>
    );
  }
  return <></>;
}
