export const getErrorMessage = (error: any, customMessage?: string) => {
  const data = error?.response?.data;
  const message = hasMessage(data)
    ? data?.message
    : hasMessage(error?.message)
      ? error?.message
      : customMessage || 'Something went wrong.';
  return message;
};
export const hasMessage = (data: any): data is { message: string } => {
  return typeof data === 'object' && 'message' in data;
};
