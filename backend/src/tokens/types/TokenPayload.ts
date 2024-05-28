export type TokenPayload = {
  id: string;
  email: string;
  role: string;
  isActivated: boolean;
  isTwoFAEnabled: boolean;
  isDeviceTrusted: boolean;
};
