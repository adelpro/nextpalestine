'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryKeys } from '@/utils/types';
import { toast } from 'react-hot-toast';
import axiosClient from '@/utils/axios';
import { AxiosError } from 'axios';

export default function useUpdatProfile() {
  const queryClient = useQueryClient();
  async function updateProfile({
    name,
    email,
    about,
  }: {
    name: string;
    email: string;
    about: string;
  }): Promise<{ message: string }> {
    const data = { user: { name, email, about } };
    const response = await axiosClient.patch('me', data);
    return response.data;
  }
  const updateProfileMutation = useMutation<
    { message: string },
    AxiosError,
    { name: string; email: string; about: string }
  >({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.ProfileImage, QueryKeys.Me]);
      toast.success('Profile updated successfully.');
    },
  });
  return {
    updateProfileMutation,
  };
}
