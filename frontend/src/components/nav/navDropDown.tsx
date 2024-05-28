import { Link } from 'next-view-transitions';

import React, { Dispatch, SetStateAction } from 'react';
import useSignout from '@/hooks/useSignout';

import Spinner from '../spinner';

type Props = {
  setIsDropdownOpen: Dispatch<SetStateAction<boolean>>;
  closeNavMenu: () => void;
};

export default function NavDropDown({
  setIsDropdownOpen,
  closeNavMenu,
}: Props) {
  const { signoutMutation } = useSignout();
  const handleSignout = () => {
    signoutMutation.mutate();
    closeNavMenu();
  };
  const handleLinkClick = () => {
    setIsDropdownOpen(false);
    closeNavMenu();
  };
  return (
    <div className="inline-flex bg-white border rounded-md">
      <div className="relative">
        <div className="absolute right-0 z-10 w-48 mt-4 text-center origin-top-right bg-white border border-gray-100 rounded-md shadow-lg md:w-36 md:text-left">
          <div className="flex flex-col justify-start">
            <Link
              onClick={handleLinkClick}
              href="/me"
              className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            >
              My profile
            </Link>
            <Link
              onClick={handleLinkClick}
              href="/me/dashboard"
              className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            >
              Dashboard
            </Link>

            <button
              onClick={handleSignout}
              className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 md:text-left"
              disabled={signoutMutation.isLoading}
            >
              {signoutMutation.isLoading ? (
                <div className="flex items-center justify-center text-gray-500">
                  <Spinner />
                </div>
              ) : (
                'Signout'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
