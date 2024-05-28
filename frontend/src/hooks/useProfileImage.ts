'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils/errorMessage';
import { QueryKeys } from '@/utils/types';
import axiosClient from '@/utils/axios';
import { AxiosError } from 'axios';

import { toast } from 'react-hot-toast';

export default function useProfileImage() {
  const queryClient = useQueryClient();
  const getProfileImage = async (): Promise<string> => {
    const response = await axiosClient.get<{ url: string }>('me/profile-image');
    const url = `${process.env.NEXT_PUBLIC_FRONTEND_URL + '/api/proxy' + response.data?.url}`;
    return url;
  };
  const profileImageQuery = useQuery<string, AxiosError>({
    queryKey: [QueryKeys.ProfileImage],
    queryFn: getProfileImage,
  });

  const updateProfileImage = async (image: any) => {
    const formData = new FormData();
    formData.append('image', image);
    const response = await axiosClient.post('me/profile-image', image, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  };

  const updateProfileImageMutation = useMutation({
    mutationFn: updateProfileImage,
    mutationKey: [QueryKeys.ProfileImage],
    onError(error: AxiosError) {
      const message = getErrorMessage(error, 'Failed to update profile image.');
      toast.error(message);
    },
    onSettled() {
      queryClient.invalidateQueries([QueryKeys.ProfileImage]);
    },
  });
  const deleteProfileImage = async (): Promise<{ message: string }> => {
    const response = await axiosClient.delete('me/profile-image');
    return response.data;
  };

  const deleteProfileImageMutation = useMutation<
    { message: string },
    AxiosError
  >({
    mutationFn: deleteProfileImage,
    mutationKey: [QueryKeys.ProfileImage],
    onSuccess: () => {
      toast.success('Profile image deleted successfully.');
    },
    onError(error: AxiosError) {
      const message = getErrorMessage(error, 'Failed to delete profile image.');
      toast.error(message);
    },
    onSettled() {
      queryClient.invalidateQueries([QueryKeys.ProfileImage]);
    },
  });
  const {
    data: profileImage,
    isLoading: isLoadingProfileImage,
    isError: isErrorProfileImage,
  } = profileImageQuery;
  return {
    profileImage,
    isLoadingProfileImage,
    isErrorProfileImage,
    updateProfileImageMutation,
    deleteProfileImageMutation,
  };
}
