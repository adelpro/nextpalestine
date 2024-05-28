'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QueryKeys, User } from '@/utils/types';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import axiosClient from '@/utils/axios';
import { AxiosError } from 'axios';

export default function UseMe() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const getMe = async (): Promise<User> => {
    const response = await axiosClient.get<User>('me');
    return response.data;
  };
  const callbackValue = null;
  const {
    data: me = callbackValue,
    isLoading: isLoadingMe,
    isError: isErrorMe,
  } = useQuery<User, AxiosError>({
    queryKey: [QueryKeys.Me],
    queryFn: getMe,
  });
  const deleteMe = async () => {
    await axiosClient.delete('me');
  };

  const deleteMeMutation = useMutation({
    mutationFn: deleteMe,
    onSuccess: () => {
      queryClient.removeQueries();
      toast.success('User account deleted successfully.');
      router.replace('/account-deleted');
    },
    onError() {
      queryClient.clear();
    },
    onSettled: () => {
      queryClient.invalidateQueries([QueryKeys.Me]);
    },
  });

  return {
    me,
    isLoadingMe,
    isErrorMe,
    deleteMeMutation,
  };
}
