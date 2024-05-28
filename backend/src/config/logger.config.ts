import { WinstonModuleOptions, utilities } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { format, transports } from 'winston';
import 'winston-daily-rotate-file';

const errorLogFilename = `logs/%DATE%-error.log`;
const combinedLogFilename = `logs/%DATE%-combined.log`;
const logDatePattern = 'YYYY-MM-DD';
const logMaxFiles = '30d';
let logFormat;

// Loading config
const configService = new ConfigService();
const USE_JSON_LOGGER = configService.get<boolean>('USE_JSON_LOGGER');
const APP_NAME = configService.get<string>('APP_NAME');
const NODE_ENV = configService.get<string>('NODE_ENV');
// End loading config

if (USE_JSON_LOGGER === true) {
  logFormat = format.combine(format.ms(), format.timestamp());
} else {
  logFormat = format.combine(
    format.ms(),
    format.timestamp(),
    utilities.format.nestLike(APP_NAME, {
      colors: true,
      prettyPrint: true,
    }),
  );
}

const errorTransport = new transports.DailyRotateFile({
  filename: errorLogFilename,
  level: 'error',
  format: logFormat,
  datePattern: logDatePattern,
  zippedArchive: false,
  maxFiles: logMaxFiles,
});

const combinedTransport = new transports.DailyRotateFile({
  filename: combinedLogFilename,
  format: logFormat,
  datePattern: logDatePattern,
  zippedArchive: false,
  maxFiles: logMaxFiles,
});

const consoleTransport = new transports.Console({
  level: NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  handleExceptions: true,
});

const loggerConfig: WinstonModuleOptions = {
  transports: [errorTransport, combinedTransport, consoleTransport],
};

export { loggerConfig, errorTransport, combinedTransport, consoleTransport };
