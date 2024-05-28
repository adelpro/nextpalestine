import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { ValidationExceptionFilter } from './exceptions/validation.exception.filter';
import { MongooseExceptionFilter } from './exceptions/monoose.exception.filter';
import { EnvConfigDTO } from './config/env/env.config.dto';
import { loggerConfig } from './config/logger.config';
import { corsConfigs } from './config/cors.config';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import tracer from './tracer';

async function bootstrap() {
  await tracer.start();
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(loggerConfig),
  });
  const configService = app.get(ConfigService<EnvConfigDTO, true>);

  app.enableCors(corsConfigs);
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new MongooseExceptionFilter());
  app.useGlobalFilters(new ValidationExceptionFilter());

  app.use(cookieParser());

  if (configService.getOrThrow<string>('USE_JSON_LOGGER') === 'true') {
    app.useLogger([]);
  }
  const options = new DocumentBuilder()
    .setTitle(configService.get<string>('APP_NAME'))
    .setVersion(configService.get<string>('APP_VERSION'))
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  // Start the tracer for SigNoz monitoring using opentelemetry
  await app.listen(parseInt(configService.getOrThrow<string>('BACKEND_PORT')), '0.0.0.0', () => {
    logger.debug(`Server is running on port ${configService.getOrThrow<string>('BACKEND_PORT')}`);
    logger.debug(`Swagger is running on /docs`);
    logger.debug(`Website is running on ${configService.getOrThrow<string>('WEBSITE')}`);
  });
}
bootstrap();
