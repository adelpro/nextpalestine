'use client';

import { useRouter } from 'next/navigation';

import { isSignedin } from '@/recoil/store';

import { useMutation } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';
import { toast } from 'react-hot-toast';
import axiosClient from '@/utils/axios';
import { User } from '@/utils/types';
import { AxiosError } from 'axios';

type SigninType = {
  email: string;
  password: string;
};
async function signin(email: string, password: string): Promise<User> {
  const data = { user: { email, password } };
  const response = await axiosClient.post('/auth/local/signin', data);
  return response.data;
}

export function useSignIn() {
  const router = useRouter();
  const setIsSignedinValue = useSetRecoilState(isSignedin);
  const signinMutation = useMutation<User, AxiosError, SigninType>({
    mutationFn: ({ email, password }: SigninType) => signin(email, password),
    onSuccess: () => {
      setIsSignedinValue(true);
      toast.success('User Signed in successfully.');
      router.replace('/');
    },
    onError(error: AxiosError) {
      if (error.response?.status === 403) {
        router.replace('/me/account-activation');
        setIsSignedinValue(true);
        //toast.error('Account not activated yet');
        return;
      }
      if (error.response?.status === 430) {
        router.replace('/me/two-fa/verify');
        setIsSignedinValue(true);
        //toast.error('2FA verification required');
        return;
      }
      setIsSignedinValue(false);
    },
  });
  return { signinMutation };
}
