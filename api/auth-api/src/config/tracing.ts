// import otel from '@opentelemetry/api';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import process from 'process';
import { GrpcInstrumentation } from '@opentelemetry/instrumentation-grpc';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';
import { registerInstrumentations } from '@opentelemetry/instrumentation';

import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
// import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
// import {
//   PeriodicExportingMetricReader,
//   MeterProvider,
// } from '@opentelemetry/sdk-metrics';
import { PrismaInstrumentation } from '@prisma/instrumentation';

// import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

registerInstrumentations({
  instrumentations: [
    new WinstonInstrumentation(),
    new GrpcInstrumentation(),
    new PrismaInstrumentation(),
  ],
});

const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: `${process.env.npm_package_name}-${process.env.NODE_ENV}`,
  [SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version,
});

// const metricReader = new PeriodicExportingMetricReader({
//   exporter: new OTLPMetricExporter({
//     url: 'http://localhost:4318/v1/metrics',
//   }),

//   // Default is 60000ms (60 seconds). Set to 3 seconds for demonstrative purposes only.
//   exportIntervalMillis: 10000,
// });

// const meterProvider = new MeterProvider({
//   resource: resource,
// });

// meterProvider.addMetricReader(metricReader);

// otel.metrics.setGlobalMeterProvider(meterProvider);

const provider = new NodeTracerProvider({
  resource,
});

const exporter = new OTLPTraceExporter({
  url: process.env.JAEGER_URL || 'http://localhost:4318/v1/traces',
});
const spanProcessor = new SimpleSpanProcessor(exporter);
provider.addSpanProcessor(spanProcessor as any);
provider.register();

// // gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  provider
    .shutdown()
    .then(
      () => console.log('SDK shut down successfully'),
      (err) => console.log('Error shutting down SDK', err),
    )
    .finally(() => process.exit(0));
});
