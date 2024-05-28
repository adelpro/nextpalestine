export const isUser = (obj: any): boolean => {
  if (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'email' in obj &&
    'name' in obj &&
    'accessToken' in obj
  ) {
    return true;
  }
  return false;
};
