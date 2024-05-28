export function getFingerprint(): { fingerprint: string | null } {
  if (typeof window === 'undefined') {
    return { fingerprint: null };
  }

  const { ClientJS } = require('clientjs');
  const client = new ClientJS();

  const fingerprint = client.getFingerprint().toString();

  return { fingerprint };
}
