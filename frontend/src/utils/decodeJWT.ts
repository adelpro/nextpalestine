const base64UrlDecode = (base64Url: string): string => {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const buff = Buffer.from(base64, 'base64');
  return buff.toString('utf-8');
};

const decodeJwtToken = (token: string): Record<string, any> | null => {
  const [, payloadBase64] = token.split('.');
  if (!payloadBase64) {
    return null;
  }
  const decodedPayload = base64UrlDecode(payloadBase64);
  return JSON.parse(decodedPayload);
};
export { decodeJwtToken };
