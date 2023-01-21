import type { Handle } from '@sveltejs/kit';
import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import { ChannelCredentials } from '@grpc/grpc-js';
import { TaskServiceClient } from '$lib/taskService/task/v1alpha/task.client';

export const handle: Handle = async ({ event, resolve }) => {
	const transport = new GrpcTransport({
		host: 'localhost:4000',
		channelCredentials: ChannelCredentials.createInsecure()
	});
	const client = new TaskServiceClient(transport);

	event.locals.client = client;

	const response = await resolve(event);
	return response;
};
