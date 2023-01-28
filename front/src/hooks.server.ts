import type { Handle } from '@sveltejs/kit';
import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import { ChannelCredentials } from '@grpc/grpc-js';
import { TaskServiceClient } from '$lib/stubs/task/v1alpha/task.client';

const transport = new GrpcTransport({
	host: 'localhost:4000',
	channelCredentials: ChannelCredentials.createInsecure()
});
const client = new TaskServiceClient(transport);

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.client = client;

	const response = await resolve(event);

	return response;
};
