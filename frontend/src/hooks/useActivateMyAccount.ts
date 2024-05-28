'use client';

import { useRouter } from 'next/navigation';

import { getErrorMessage } from '@/utils/errorMessage';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import axiosClient from '@/utils/axios';
import { AxiosError } from 'axios';

async function sendActivationEmail(): Promise<{ message: string }> {
  const response = await axiosClient.get('me/account-activation');
  return response.data;
}
async function activateMyAccount(token: string): Promise<{ message: string }> {
  const data = { token };
  const response = await axiosClient.post(
    '/me/account-activation',
    JSON.stringify(data),
  );
  return response.data;
}
export default function useActivateMyAccount() {
  const router = useRouter();
  const activateMyAccountMutation = useMutation<
    { message: string },
    AxiosError,
    { token: string }
  >({
    mutationFn: (data) => activateMyAccount(data.token),
    onSuccess: () => {
      router.replace('/');
      toast.success('Account activated successfully.');
    },
    onError: (error: AxiosError) => {
      const message = getErrorMessage(
        error,
        'Failed to activate your account, Please try again later.',
      );
      toast.error(message);
    },
  });
  const sendActivationEmailMutation = useMutation({
    mutationFn: sendActivationEmail,
    onSuccess: () => {
      router.replace('/');
      toast.success('Activation email sent successfully.');
    },
  });
  return {
    activateMyAccountMutation,
    sendActivationEmailMutation,
  };
}
