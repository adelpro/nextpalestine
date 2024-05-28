'use client';

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useState } from 'react';

import { isSignedin, isThrottled } from '@/recoil/store';
import { getErrorMessage } from '../utils/errorMessage';
import { useRecoilState, useRecoilValue } from 'recoil';
import { QueryError, QueryKeys } from '../utils/types';

type Props = {
  children: React.ReactNode;
};
export default function ReactQueryWrapper({ children }: Props) {
  const [isThrottledValue, setIsThrottled] = useRecoilState(isThrottled);
  const isSignedInValue = useRecoilValue(isSignedin);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: false,
            staleTime: 24 * 60 * 60 * 1000, //Twenty Four Hours In Ms
          },
          mutations: {
            retry: false,
          },
        },
        queryCache: new QueryCache({
          onError: (error, query) => {
            const queryError = error as QueryError;

            // Handle throttling (429) error for queries
            // Redirect to /too-many-requests
            if (queryError?.response?.status === 429) {
              setIsThrottled(true);
              return;
            }

            // prevent 401 (unauthorized) error for Me query and ProfileImage query
            if (
              queryError?.response?.status === 401 &&
              query.queryKey.toString() === (QueryKeys.Me as string)
            ) {
              return;
            }

            if (
              queryError?.response?.status === 401 &&
              query.queryKey.toString() === (QueryKeys.ProfileImage as string)
            ) {
              return;
            }

            const message = getErrorMessage(
              error,
              'Unknown Error, please try again later...',
            );
            toast.error(message);
          },
        }),
        mutationCache: new MutationCache({
          onError: (error, _variables, _context, _mutation) => {
            //if (mutation.options.onError) return;
            const queryError = error as QueryError;
            const message = getErrorMessage(
              queryError,
              'Unknown Error, please try again later...',
            );
            toast.error(message);

            // Handle throttling (429) error for mutations
            // Redirect to /too-many-requests
            if (queryError?.response?.status === 429) {
              setIsThrottled(true);
              return;
            }
          },
        }),
      }),
  );
  queryClient.setQueriesData(Object.values(QueryKeys), {
    enabled: !isThrottledValue && isSignedInValue,
    retry: isSignedInValue,
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
