'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MeTokensData, QueryKeys } from '@/utils/types';
import { getErrorMessage } from '@/utils/errorMessage';
import { toast } from 'react-hot-toast';
import axiosClient from '@/utils/axios';
import { AxiosError } from 'axios';

import UseMe from './useMe';

export default function useMeTokens() {
  const queryClient = useQueryClient();
  const getMeTokens = async (): Promise<MeTokensData> => {
    const response = await axiosClient.get<MeTokensData>('tokens/my-tokens');
    const { tokens, currentTokenId } = response.data;
    return { tokens, currentTokenId };
  };
  const { me } = UseMe();

  const meTokensQuery = useQuery<MeTokensData, AxiosError>({
    queryKey: [QueryKeys.MyTokens, me?.id],
    queryFn: getMeTokens,
  });
  const deleteToken = async (tokenId: string) => {
    await axiosClient.delete(`tokens/${tokenId}`);
  };

  const deleteTokenMutation = useMutation({
    mutationFn: deleteToken,
    onError(error: AxiosError) {
      const message = getErrorMessage(error, 'Failed to delete token.');
      toast.error(message);
    },
    onSettled: () => queryClient.invalidateQueries([QueryKeys.MyTokens]),
  });
  const {
    data: meTokens,
    isLoading: isLoadingMyTokens,
    isError: isErrorMyTokens,
  } = meTokensQuery;
  return {
    myTokens: meTokens?.tokens,
    CurrentTokenId: meTokens?.currentTokenId,
    isLoadingMyTokens,
    isErrorMyTokens,
    deleteTokenMutation,
  };
}
