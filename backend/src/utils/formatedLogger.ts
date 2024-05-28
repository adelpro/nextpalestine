import { loggerConfig } from '@/config/logger.config';
import { LoggerService } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';

const logger = WinstonModule.createLogger(loggerConfig) as LoggerService & {
  verbose: (message: string, context?: string) => void;
  debug: (message: string, context?: string) => void;
};
export function formatedLogger(name: string) {
  return {
    log: (message: string) => logger.log(message, name),
    debug: (message: string) => logger.debug(message, name),
    error: (message: string) => logger.error(message, name),
    warn: (message: string) => logger.warn(message, name),
    verbose: (message: string) => logger.verbose(message, name),
  };
}
