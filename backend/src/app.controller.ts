import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
  HttpHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
@Controller()
export class AppController {
  constructor(
    private readonly configService: ConfigService,
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly database: MongooseHealthIndicator,
  ) {}
  @Throttle(60, 20)
  @Get('/')
  welcome() {
    return {
      application: this.configService.getOrThrow<string>('APP_NAME'),
      version: this.configService.getOrThrow<string>('APP_VERSION'),
      mode: this.configService.getOrThrow<string>('NODE_ENV'),
    };
  }

  @Get('/health')
  @HttpCode(HttpStatus.OK)
  @HealthCheck()
  async checkHealth(): Promise<HealthCheckResult | Omit<HealthCheckResult, 'details'>> {
    const APP_NAME = this.configService.getOrThrow<string>('APP_NAME');
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    const health = await this.health.check([
      async (): Promise<HealthIndicatorResult> => ({
        [APP_NAME]: { status: 'up' },
      }),
      async () => this.database.pingCheck('database', { timeout: 300 }),
    ]);
    if (isProduction) {
      // In production, return minimal details
      return {
        status: health.status,
        info: health.info,
      };
    }
    return health;
  }

  @Throttle(60, 20)
  @Get('/test')
  test(@Res() response: Response) {
    return response.status(401).json({ message: 'test - throttleling', status: 429 });
  }
}
