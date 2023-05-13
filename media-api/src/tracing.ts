import {
  BatchSpanProcessor,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import * as process from 'process';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { OpenTelemetryModuleConfig } from '@metinseylan/nestjs-opentelemetry';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import { ConfigService } from '@nestjs/config';

export const opentelemetryConfig = (cs: ConfigService) => {
  const traceExporter = new JaegerExporter({
    endpoint: cs.get('JAEGER_URL'),
  });

  const spanProcessor =
    cs.get('NODE_ENV') === `production`
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
    instrumentations: [new PrismaInstrumentation()],
  } as Partial<OpenTelemetryModuleConfig>;
};
