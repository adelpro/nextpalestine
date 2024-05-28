'use client';

import { useRouter } from 'next/navigation';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils/errorMessage';
import { isSignedin } from '@/recoil/store';
import { useSetRecoilState } from 'recoil';
import { toast } from 'react-hot-toast';
import axiosClient from '@/utils/axios';
import { AxiosError } from 'axios';
import '@/utils/errorMessage';

async function signout(): Promise<void> {
  const response = await axiosClient.get('/auth/signout');
  return response.data;
}

export default function useSignout() {
  const router = useRouter();
  const setIsSignedinValue = useSetRecoilState(isSignedin);
  const queryClient = useQueryClient();
  const signoutMutation = useMutation<void, AxiosError>({
    mutationFn: () => signout(),
    onSuccess: () => {
      queryClient.removeQueries();
      setIsSignedinValue(false);
      toast.success('You are signed out successfully.');
      router.replace('/success?title=Signed out successfully');
    },
    onError: (error: AxiosError) => {
      queryClient.removeQueries();
      setIsSignedinValue(false);
      const message = getErrorMessage(error, 'Failed to Sign out.');
      // toast.error(message);
    },
  });
  return { signoutMutation };
}
