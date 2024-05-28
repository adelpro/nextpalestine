'use strict';

import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { formatedLogger } from './utils/formatedLogger';
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { ConfigService } from '@nestjs/config';
import * as opentelemetry from '@opentelemetry/sdk-node';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node';
//import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
const logger = formatedLogger('Signoz');

const configService = new ConfigService();
const TRACE_ENDPOINT = configService.getOrThrow<string>('TRACE_ENDPOINT');
const TRACE_ENABLED = configService.getOrThrow<boolean>('TRACE_ENABLED');
const SERVICE_NAME = configService.getOrThrow<string>('APP_NAME');
logger.debug('TRACE_ENABLED: ' + TRACE_ENABLED);
logger.debug('TRACE_ENDPOINT: ' + TRACE_ENDPOINT);

// Enable logging for debugging
//diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

// Configure the SDK to export telemetry data to SigNoz
const exporterOptions = {
  url: TRACE_ENDPOINT,
  timeoutMillis: 5000, // Set a 5-second timeout
  // Retry configuration
  headers: {
    'Content-Type': 'application/json',
  },
};

const traceExporter = new OTLPTraceExporter(exporterOptions);
const spanProcessor = new SimpleSpanProcessor(traceExporter);
const sdk = new opentelemetry.NodeSDK({
  traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-nestjs-core': { enabled: false },
      '@opentelemetry/instrumentation-winston': { enabled: false },
      '@opentelemetry/instrumentation-aws-lambda': { enabled: false },
      '@opentelemetry/instrumentation-aws-sdk': { enabled: false },
      '@opentelemetry/instrumentation-express': { enabled: false },
      '@opentelemetry/instrumentation-fastify': { enabled: false },
      '@opentelemetry/instrumentation-mongodb': { enabled: false },
      '@opentelemetry/instrumentation-mongoose': { enabled: false },
    }),
  ],
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: SERVICE_NAME,
  }),
  spanProcessors: [spanProcessor],
});

if (TRACE_ENABLED) {
  sdk.start();
  logger.debug('Tracing started');
}

// Gracefully shut down the SDK on process exit
const shutdown = () => {
  sdk
    .shutdown()
    .then(() => logger.log('Tracing terminated'))
    .catch((error) => logger.error('Error terminating tracing: ' + error))
    .finally(() => process.exit(0));
};
process.on('exit', shutdown);
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
export default sdk;
