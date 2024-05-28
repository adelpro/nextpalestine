export type User = {
  id: string;
  _id: string;
  email: string;
  name: string;
  about: string;
  role: string;
  isActivated: boolean;
  isTwoFAEnabled: boolean;
  isDeviceTrusted?: boolean;
  profileImage?: string;
};
export type Token = {
  id: string;
  label: string;
};
export interface POST {
  // can be extracted from params.id
  _id?: string;
  // can be extracted from jwt-guard on the backend
  user?: string;
  title: string;
  excerpt: string;
  content: string;
  isPublished: boolean;
  publishedAt: string;
  updatedAt: string;
}
export type NewPOST = {
  title: string;
  excerpt: string;
  content: string;
  isPublished: boolean;
};
export type UpdatedPOST = {
  // FIXME Manage updatedAt in the backend
  title: string;
  excerpt: string;
  content: string;
  isPublished: boolean;
};
export enum QueryKeys {
  Me = 'me',
  MyTokens = 'myTokens',
  ProfileImage = 'profileImage',
  GetSignedURL = 'getSignedURL',
  PostImage = 'postImage',
  QRCode = 'qrcode',
  MePosts = 'mePosts',
  MePost = 'mePost',
  GetFileData = 'getFileData',
}

export type QueryError = {
  response?: {
    status: number;
    message: string;
  };
};

export type MeTokensData = { tokens: Token[]; currentTokenId: string };
