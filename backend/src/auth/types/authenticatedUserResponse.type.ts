import { AuthenticatedUser } from './authenticatedUser.type';
import { Provider } from './providers.type';

export type AuthenticatedUserResponse = Omit<AuthenticatedUser, 'token'> & {
  provider: Provider;
};
