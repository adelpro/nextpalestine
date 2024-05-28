'use client';

import UseMe from '@/hooks/useMe';

import DisableTwoFA from './disableTwoFA';
import EnableTwoFA from './enableTwoFA';

export default function TwoFA() {
  const { me } = UseMe();
  if (me?.isTwoFAEnabled) {
    return <DisableTwoFA />;
  }
  return <EnableTwoFA />;
}
