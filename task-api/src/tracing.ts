import {
  BatchSpanProcessor,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import * as process from 'process';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { OpenTelemetryModuleConfig } from '@metinseylan/nestjs-opentelemetry';

export const opentelemetryConfig = () => {
  const traceExporter = new JaegerExporter({
    endpoint: process.env.JAEGER_URL,
  });

  const spanProcessor =
    process.env.NODE_ENV === `production`
      ? new BatchSpanProcessor(traceExporter)
      : new SimpleSpanProcessor(traceExporter);

  return {
    serviceName: process.env.npm_package_name,
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: process.env.npm_package_name,
      [SemanticResourceAttributes.SERVICE_VERSION]:
        process.env.npm_package_version,
    }),
    spanProcessor: spanProcessor as any,
  } as Partial<OpenTelemetryModuleConfig>;
};
