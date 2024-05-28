'use client';

import { useRouter } from 'next/navigation';

import { getErrorMessage } from '@/utils/errorMessage';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

type ContactType = {
  name: string;
  email: string;
  message: string;
};
async function contact({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}): Promise<{ message: string }> {
  const data = {
    name,
    email,
    message,
  };
  const response = await axios.post('/api/send-feedback', data);

  return response.data;
}

export function useContact() {
  const router = useRouter();
  const contactMutation = useMutation<
    { message: string },
    AxiosError,
    ContactType
  >({
    mutationFn: ({ name, email, message }: ContactType) =>
      contact({ name, email, message }),
    onSuccess: () => {
      toast.success('Message sent successfully.');
      router.back();
    },
    onError(error: AxiosError) {
      const message = getErrorMessage(
        error,
        'Failed to send message, Please try again later.',
      );
      toast.error(message);
    },
  });

  return { contactMutation };
}
