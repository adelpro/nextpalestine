'use client';

import { getErrorMessage } from '@/utils/errorMessage';
import { useMutation } from '@tanstack/react-query';
import { QueryKeys } from '@/utils/types';
import { toast } from 'react-hot-toast';
import axiosClient from '@/utils/axios';
import { AxiosError } from 'axios';

export default function usePostImage() {
  const upploadPostImage = async (
    image: File,
  ): Promise<{ url: string; placeholder: string; backendId: string }> => {
    const formData = new FormData();

    formData.append('image', image);
    const response = await axiosClient.post<{
      url: string;
      placeholder: string;
      backendId: string;
    }>('me/post-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const backendId = response.headers['x-backend-id'];
    const url = `${process.env.NEXT_PUBLIC_FRONTEND_URL + '/api/proxy' + response.data?.url}`;
    const placeholder = `${process.env.NEXT_PUBLIC_FRONTEND_URL + '/api/proxy' + response.data?.placeholder}`;
    return { url, placeholder, backendId };
  };

  const uploadPostImageMutation = useMutation({
    mutationFn: upploadPostImage,
    mutationKey: [QueryKeys.PostImage],
    onSuccess: () => {
      toast.success('Post image updated successfully.');
    },
    onError(error: AxiosError) {
      const message = getErrorMessage(error, 'Failed to update post image.');
      toast.error(message);
    },
  });
  const deletePostImage = async (
    backendId: string,
  ): Promise<{ message: string }> => {
    const response = await axiosClient.delete(`me/post-image/${backendId}`);
    return response.data;
  };

  const deletePostImageMutation = useMutation({
    mutationFn: (backendId: string) => deletePostImage(backendId),
    onSuccess: () => {
      toast.success('Post image deleted successfully.');
    },
  });

  return {
    uploadPostImageMutation,
    deletePostImageMutation,
  };
}
