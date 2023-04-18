import opentelemetry, { SpanKind, SpanStatusCode, context, propagation } from '@opentelemetry/api';

import type {
	ServerStreamingCall,
	MethodInfo,
	NextServerStreamingFn,
	NextUnaryFn,
	RpcOptions,
	UnaryCall
} from '@protobuf-ts/runtime-rpc';
import winstonLogger from './winston.logger';

const tracer = opentelemetry.trace.getTracer('Sveltekit-Server');

export const otelInterceptor =
	<T extends ServerStreamingCall | UnaryCall>(url: string) =>
	(
		next: T extends UnaryCall ? NextUnaryFn : NextServerStreamingFn,
		method: MethodInfo,
		input: object,
		options: RpcOptions
	): T =>
		tracer.startActiveSpan(
			method.name,
			{
				kind: SpanKind.CLIENT,
				attributes: {
					'rpc.service': method.service.typeName,
					'rpc.method': method.name
				},
				startTime: Date.now()
			},
			(span) => {
				const out = {};
				propagation.inject(context.active(), out);

				options.meta = {
					...options.meta,
					...out
				};

				const output = next(method, input, options);

				output
					.then((response) => {
						span.setAttribute('rpc.grpc.status_code', response.status.code);
					})
					.catch((err) => {
						span.setAttribute('rpc.grpc.status_code', err.code);
						span.setStatus({
							code: SpanStatusCode.ERROR,
							message: err.message
						});
						span.setAttribute('grpc.error_message', err.message);
						err.stack && span.setAttribute('grpc.error_stack', err.stack);
						span.setAttribute('net.peer.name', url.split(':')[0]);
						span.setAttribute('net.peer.port', url.split(':')[1]);
					})
					.finally(() => {
						span.end();
					});

				return output as T;
			}
		);

export const errorLoggerInterceptor = <T extends ServerStreamingCall | UnaryCall>(
	next: T extends UnaryCall ? NextUnaryFn : NextServerStreamingFn,
	method: MethodInfo,
	input: object,
	options: RpcOptions
): T => {
	const output = next(method, input, options);
	output.then().catch((err) => {
		winstonLogger.error(err);
	});

	return output as T;
};
