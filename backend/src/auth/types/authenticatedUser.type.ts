export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
  about?: string;
  role?: string;
  profileImage?: string;
  isActivated?: boolean;
  isTwoFAEnabled?: boolean;
  token: string;
};
