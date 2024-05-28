'use client';

import { useRouter } from 'next/navigation';

import { getErrorMessage } from '@/utils/errorMessage';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import axiosClient from '@/utils/axios';
import { AxiosError } from 'axios';

async function updatePassword(
  oldPassword: string,
  newPassword: string,
): Promise<{ message: string }> {
  const data = { oldPassword, newPassword };
  const response = await axiosClient.post(
    'me/update-password',
    JSON.stringify(data),
  );
  return response.data;
}

export default function useUpdatePassword() {
  const router = useRouter();
  const updatePasswordMutation = useMutation<
    { message: string },
    AxiosError,
    { oldPassword: string; newPassword: string }
  >({
    mutationFn: ({ oldPassword, newPassword }) =>
      updatePassword(oldPassword, newPassword),
    onSuccess: () => {
      router.replace('/');
      toast.success('Password updated successfully.');
    },
  });
  return {
    updatePasswordMutation,
  };
}
