import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FingerprintObj } from '../types/fingerprint.type';
import { Request } from 'express';

export const Fingerprint = createParamDecorator(async (_data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const fingerprint = await extractFingerprint(request);
  return fingerprint;
});
async function extractFingerprint(request: Request): Promise<FingerprintObj> {
  const userAgentHeader = request.headers['user-agent'] || '';
  const fingerprint = request.headers['x-fingerprint'] || request.headers['X-Fingerprint'] || '';

  return { label: userAgentHeader, value: fingerprint as string };
}
