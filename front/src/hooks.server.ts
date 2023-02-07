import type { Handle } from '@sveltejs/kit';
import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import { ChannelCredentials } from '@grpc/grpc-js';
import { TaskServiceClient } from '$lib/stubs/task/v1alpha/task.client';
import fs from 'fs';

const transport = new GrpcTransport({
	host: process.env.SERVER || 'localhost:4000',
	channelCredentials: process.env.secure
		? ChannelCredentials.createSsl(
				fs.readFileSync(process.env.ROOT_CERT || ''),
				fs.readFileSync(process.env.CERT_KEY || '')
		  )
		: ChannelCredentials.createInsecure()
});
const client = new TaskServiceClient(transport);

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.client = client;

	const response = await resolve(event);

	return response;
};
