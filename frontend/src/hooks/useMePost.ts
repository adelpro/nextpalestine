'use client';

import { useParams, useRouter } from 'next/navigation';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UpdatedPOST, POST, QueryKeys } from '@/utils/types';
import { getErrorMessage } from '@/utils/errorMessage';
import { toast } from 'react-hot-toast';
import axiosClient from '@/utils/axios';
import { AxiosError } from 'axios';

export default function UseMePost() {
  const queryClient = useQueryClient();
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const getMePost = async (): Promise<POST> => {
    const response = await axiosClient.get<POST>(`me/post/${id}`);
    return response.data;
  };

  const mePostQuery = useQuery<POST, AxiosError>({
    queryKey: [QueryKeys.MePost],
    queryFn: () => getMePost(),
    enabled: !!id,
  });
  const deleteMePost = async (id: string) => {
    await axiosClient.delete(`/me/post/${id}`);
  };

  const deleteMePostMutation = useMutation({
    mutationFn: deleteMePost,
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.MePosts]);
      toast.success('Post deleted successfully.');
      router.push('/me');
    },
    onError: (error: AxiosError) => {
      queryClient.invalidateQueries([QueryKeys.MePosts]);
      const message = getErrorMessage(
        error,
        'Failed to delete post, Please try again later.',
      );
      toast.error(message);
      router.push('/me');
    },
  });

  const {
    data: mePost,
    isLoading: isLoadingMePost,
    isError: isErrorMePost,
  } = mePostQuery;
  // FIXME Add TYPING to newpost

  const updateMePost = async (updatedPost: UpdatedPOST) => {
    const data = { post: updatedPost };
    await axiosClient.put(`/me/post/${id}`, data);
  };
  const updateMePostMutation = useMutation({
    mutationFn: (updatedPost: UpdatedPOST) => updateMePost(updatedPost),
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.MePost]);
      toast.success('Post updated successfully.');
    },
    onError: (error: AxiosError) => {
      queryClient.invalidateQueries([QueryKeys.MePost]);
      const message = getErrorMessage(
        error,
        'Failed to update post, Please try again later.',
      );
      toast.error(message);
    },
  });

  const newMePost = async (newPost: UpdatedPOST) => {
    const data = { post: newPost };
    await axiosClient.post('me/post', data);
  };
  const newMePostMutation = useMutation({
    mutationFn: (newPost: UpdatedPOST) => newMePost(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.MePost]);
      toast.success('New post created successfully.');
    },
    onError: (error: AxiosError) => {
      queryClient.invalidateQueries([QueryKeys.MePost]);
      const message = getErrorMessage(
        error,
        'Failed to create new post, Please try again later.',
      );
      toast.error(message);
    },
  });

  return {
    mePost,
    isLoadingMePost,
    isErrorMePost,
    updateMePostMutation,
    newMePostMutation,
    deleteMePostMutation,
  };
}
