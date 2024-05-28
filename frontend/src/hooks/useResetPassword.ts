'use client';

import { useRouter } from 'next/navigation';

import { getErrorMessage } from '@/utils/errorMessage';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import axiosClient from '@/utils/axios';
import { AxiosError } from 'axios';
import '@/utils/errorMessage';

async function sendResetPasswordEmail(
  email: string,
): Promise<{ message: string }> {
  const data = { email };
  const response = await axiosClient.post('/reset-password/send-email', data);
  return response.data;
}
async function resetPassword(
  token: string,
  password: string,
): Promise<{ message: string }> {
  const data = { token, password };
  const response = await axiosClient.post('/reset-password/validate', data);
  return response.data;
}

export default function useResetPassword() {
  const router = useRouter();
  const sendResetPasswordEmailMutation = useMutation<
    { message: string },
    AxiosError,
    { email: string }
  >({
    mutationFn: ({ email }) => sendResetPasswordEmail(email),
    onSuccess: () => {
      router.replace('/');
      toast.success('Reset password email sent successfully.');
    },
  });
  const resetPasswordMutation = useMutation<
    { message: string },
    AxiosError,
    { token: string; password: string }
  >({
    mutationFn: ({ token, password }) => resetPassword(token, password),
    onSuccess: () => {
      router.replace('/');
      toast.success('Reset password successfully.');
    },
    onError: (error: AxiosError) => {
      const message = getErrorMessage(
        error,
        'Failed to reset password, Please try again later.',
      );
      toast.error(message);
    },
  });
  return {
    sendResetPasswordEmailMutation,
    resetPasswordMutation,
  };
}
