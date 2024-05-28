import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();
const allowedOrigins = configService.get<string>('CORS_ORIGIN');

export const corsConfigs = {
  origin: function (origin: string, cb: (err: Error | null, allow?: boolean) => void) {
    // Remove ||!origin to block Postman request
    // If there is no allowedOrigins in the env file, pass true
    // To test other origins, add 'Origin' to the request header in postman

    if (!allowedOrigins || allowedOrigins.indexOf(origin) !== -1 || !origin) {
      cb(null, true);
    } else {
      cb(new Error('origin not allowed by Cors'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
