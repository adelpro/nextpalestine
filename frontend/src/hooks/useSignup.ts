'use client';

import { useRouter } from 'next/navigation';

import { getFingerprint } from '@/utils/getFingerprint';
import { getErrorMessage } from '@/utils/errorMessage';
import { useMutation } from '@tanstack/react-query';
import { isSignedin } from '@/recoil/store';
import { useSetRecoilState } from 'recoil';
import { toast } from 'react-hot-toast';
import axiosClient from '@/utils/axios';
import { User } from '@/utils/types';
import { AxiosError } from 'axios';

async function signup(
  name: string,
  email: string,
  password: string,
): Promise<User> {
  const data = { user: { name, email, password } };
  const { fingerprint } = getFingerprint();
  const response = await axiosClient.post(
    '/auth/local/signup',
    JSON.stringify(data),
    {
      headers: {
        fingerprint,
      },
    },
  );
  console.log('sginup response: ', response);
  return response.data;
}

export function useSignup() {
  const router = useRouter();
  const setIsSignedinValue = useSetRecoilState(isSignedin);
  const signupMutation = useMutation<
    User,
    AxiosError,
    { email: string; name: string; password: string }
  >({
    mutationFn: ({
      name,
      email,
      password,
    }: {
      email: string;
      name: string;
      password: string;
    }) => signup(name, email, password),
    onSuccess: () => {
      toast.success('User Signed up successfully.');
      router.replace('/');
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 403) {
        setIsSignedinValue(true);
        //toast.error('Account not activated yet');
        router.replace('/me/account-activation');
        return;
      }
      setIsSignedinValue(false);
      const message = getErrorMessage(error, 'Failed to Sign up.');
      //toast.error(message);
    },
  });
  return { signupMutation };
}
