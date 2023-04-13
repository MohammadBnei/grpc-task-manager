import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  SpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import process from 'process';
import { GrpcInstrumentation } from '@opentelemetry/instrumentation-grpc';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';
import { registerInstrumentations } from '@opentelemetry/instrumentation';

import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const traceExporter = new ConsoleSpanExporter();
const spanProcessor = new SimpleSpanProcessor(traceExporter);
const provider = new NodeTracerProvider();
provider.addSpanProcessor(spanProcessor as any);
provider.register();

export const otelSDK = new NodeSDK({
  spanProcessor: spanProcessor,
  serviceName: process.env.npm_package_name,
  instrumentations: [
    new WinstonInstrumentation({
      enabled: true,
      // Optional hook to insert additional context to log metadata.
      // Called after trace context is injected to metadata.
      logHook: (span, record) => {
        record['resource.service.name'] =
          provider.resource.attributes['service.name'];
        record['resource.service.version'] =
          provider.resource.attributes['service.version'];
        span.setAttributes(record);
      },
    }),
    new GrpcInstrumentation(),
  ],
  traceExporter: traceExporter,
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.npm_package_name,
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.version,
  }),
});

// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  otelSDK
    .shutdown()
    .then(
      () => console.log('SDK shut down successfully'),
      (err) => console.log('Error shutting down SDK', err),
    )
    .finally(() => process.exit(0));
});
