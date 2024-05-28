'use client';

import { useRouter } from 'next/navigation';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils/errorMessage';
import { POST, QueryKeys } from '@/utils/types';
import { toast } from 'react-hot-toast';
import axiosClient from '@/utils/axios';
import { AxiosError } from 'axios';

export default function UseMePosts() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const getMePosts = async (): Promise<POST[] | []> => {
    const response = await axiosClient.get<POST[]>('me/posts');
    return response.data;
  };

  const postsQuery = useQuery<POST[], AxiosError>({
    queryKey: [QueryKeys.MePosts],
    queryFn: getMePosts,
  });
  const {
    data: mePosts,
    isLoading: isLoadingMePosts,
    isError: isErrorMePosts,
  } = postsQuery;

  return {
    mePosts,
    isLoadingMePosts,
    isErrorMePosts,
  };
}
