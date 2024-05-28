import { IsString, IsNumber, Matches, IsDefined, IsEnum, IsNumberString, IsBooleanString } from 'class-validator';
import { Enveronements } from './types';

export class EnvConfigDTO {
  /* Environment */
  @IsEnum(Enveronements)
  @IsDefined()
  NODE_ENV: Enveronements;

  /* App config */
  @IsString()
  'APP_NAME' = 'My App';

  @IsString()
  'APP_VERSION' = '1.0.0';

  /* # Frontend URL */
  @IsString()
  WEBSITE = 'http://localhost:3540';

  /* Server config */
  @IsString()
  MONGODB_URI = 'mongodb://localhost:27017';

  @IsNumberString()
  BACKEND_PORT = 3500;

  @IsString()
  BACKEND_URL = 'http://127.0.0.1';

  @IsBooleanString()
  @Matches(/^(true|false)$/, { message: 'DEBUG must be a boolean' })
  DEBUG = true;

  @IsBooleanString()
  'USE_JSON_LOGGER' = false;

  @IsBooleanString()
  'TRACE_ENABLED' = false;

  @IsString()
  @IsDefined()
  'TRACE_ENDPOINT': string;

  /* Activation-token */
  @IsString()
  @IsDefined()
  'TEMP_JWT_SECRET': string;

  /* Time-to-live of temp-token (15min) */
  @IsNumberString()
  'TEMP_JWT_TTL_MS' = 900000;

  /* Cookie-token */
  @IsString()
  @IsDefined()
  'COOKIE_JWT_SECRET': string;

  /* Time-to-live of cookie-token (one week) */
  @IsNumberString()
  'COOKIE_JWT_TTL_MS' = 604800000;

  /* Google auth */
  @IsString()
  @IsDefined()
  'GOOGLE_CLIENT_ID': string;

  @IsString()
  @IsDefined()
  'GOOGLE_CLIENT_SECRET': string;

  @IsString()
  @IsDefined()
  'GOOGLE_CLIENT_CALLBACK': string;

  /* Github auth */
  @IsString()
  @IsDefined()
  'GITHUB_CLIENT_ID': string;

  @IsString()
  @IsDefined()
  'GITHUB_CLIENT_SECRET': string;

  @IsString()
  @IsDefined()
  'GITHUB_CLIENT_CALLBACK': string;

  /* Facebook auth */
  @IsString()
  @IsDefined()
  'FACEBOOK_CLIENT_ID': string;

  @IsString()
  @IsDefined()
  'FACEBOOK_CLIENT_SECRET': string;

  @IsString()
  @IsDefined()
  'FACEBOOK_CLIENT_CALLBACK': string;

  /* Email */
  @IsString()
  @IsDefined()
  'EMAIL_SERVICE': string;

  @IsString()
  @IsDefined()
  EMAIL: string;

  @IsDefined()
  'EMAIL_APP_SPECIFIC_PASS': string;

  @IsString()
  @IsString()
  'MAILER_HOST': string;

  @IsNumber()
  @IsDefined()
  'MAILER_PORT': number;

  /* CORS */
  @IsString()
  @Matches(
    /^(https?:\/\/)?(([a-zA-Z0-9.-]+)|localhost|127\.0\.0\.1)(:[0-9]+)?(\/\w*)?(,((https?:\/\/)?([a-zA-Z0-9.-]+)|localhost|127\.0\.0\.1)(:[0-9]+)?(\/\w*)?)*$/,
    {
      message: 'CORS_ORIGIN must be a comma-separated list of valid URLs',
    },
  )
  CORS_ORIGIN =
    'http://127.0.0.1:5500,http://localhost:3000,http://127.0.0.1:3000,localhost:3500,127.0.0.1:3500,http://127.0.0.1:3500/docs,http://localhost:3500/docs';
}
