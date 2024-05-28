import { ValidationError, validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { EnvConfigDTO } from './env.config.dto';
import { formatedLogger } from '@/utils/formatedLogger';

export function envValidate(config: Record<string, unknown>): EnvConfigDTO {
  const logger = formatedLogger('envValidate');
  const validatedConfig = plainToClass(EnvConfigDTO, config, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig, { skipMissingProperties: true });
  if (errors.length > 0) {
    const errorMessages = errors
      .map((error: ValidationError) => {
        const property = error?.property || '';
        const constraints = error?.constraints || {};
        const errorMessage = '❌ ' + property + ': {' + Object.values(constraints).join(', ') + '}';
        return errorMessage;
      })
      .join('\n');
    const variables = errors.length === 1 ? 'variable' : 'variables';
    logger.error(`Env ${variables} validation error:\n${errorMessages}`);

    // Force exit on error
    logger.error('Exiting process...');
    return process.exit(1);
  }
  logger.debug('Env variables validated successfully');
  return validatedConfig;
}
