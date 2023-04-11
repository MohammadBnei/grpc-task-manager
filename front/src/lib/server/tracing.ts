'use strict';

import process from 'process';
import opentelemetry from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { BatchSpanProcessor, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { env } from '$env/dynamic/private';

const traceExporter = new JaegerExporter({
	endpoint: env.JAEGER_URL
});

const spanProcessor =
	env.NODE_ENV === `production`
		? new BatchSpanProcessor(traceExporter)
		: new SimpleSpanProcessor(traceExporter);

const sdk = new opentelemetry.NodeSDK({
	resource: new Resource({
		[SemanticResourceAttributes.SERVICE_NAME]: env.npm_package_name,
		[SemanticResourceAttributes.SERVICE_VERSION]: env.npm_package_version
	}),
	traceExporter,
	spanProcessor,
	instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start();

// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
	sdk
		.shutdown()
		.then(() => console.log('Tracing terminated'))
		.catch((error) => console.log('Error terminating tracing', error))
		.finally(() => process.exit(0));
});
