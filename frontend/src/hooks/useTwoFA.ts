'use client';

import { useRouter } from 'next/navigation';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils/errorMessage';
import { QueryKeys } from '@/utils/types';
import { toast } from 'react-hot-toast';
import axiosClient from '@/utils/axios';
import { AxiosError } from 'axios';

async function getQRCode(): Promise<{ qrcode: string | null }> {
  const response = await axiosClient.get('/twofa/enable');

  return response.data;
}

async function verifyTwoFA({
  TOTP,
}: {
  TOTP: string;
}): Promise<{ message: string }> {
  const data = { TOTP };
  const response = await axiosClient.post('/twofa/verify', data);
  return response.data;
}
async function disableTwoFA(): Promise<{ message: string }> {
  const response = await axiosClient.get('/twofa/disable');

  return response.data;
}
export default function useTwoFA() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const QRCodeQuery = useQuery<{ qrcode: string | null }, AxiosError>({
    queryKey: [QueryKeys.QRCode],
    queryFn: getQRCode,
  });
  const QRCode = QRCodeQuery.data?.qrcode;

  const verifyTwoFAMutation = useMutation<
    { message: string | null },
    AxiosError,
    { TOTP: string }
  >({
    mutationFn: verifyTwoFA,
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.Me]);
      router.replace('/');
      toast.success('2FA verified successfully.');
    },
  });

  const disableTwoFAMutation = useMutation<
    { message: string | null },
    AxiosError
  >({
    mutationFn: () => disableTwoFA(),
    onSuccess: () => {
      queryClient.refetchQueries([QueryKeys.Me]);
      router.replace('/me/dashboard');
      toast.success('2FA disabled successfully.');
    },
    onError: (error: AxiosError) => {
      const message = getErrorMessage(
        error,
        'Failed to send 2FA email, Please try again later.',
      );
      toast.error(message);
    },
  });
  async function sendTwoFAMail(): Promise<{ message: string }> {
    const response = await axiosClient.get('/twofa/send-email');
    return response.data;
  }

  const sendTwoFAMailMutation = useMutation<
    { message: string | null },
    AxiosError
  >({
    mutationFn: sendTwoFAMail,
    onSuccess: () => {
      toast.success('2FA email sent successfully.');
    },
    onError: (error: AxiosError) => {
      const message = getErrorMessage(
        error,
        'Failed to send 2FA email, Please try again later.',
      );
      toast.error(message);
    },
  });

  return {
    QRCode,
    verifyTwoFAMutation,
    disableTwoFAMutation,
    sendTwoFAMailMutation,
  };
}
