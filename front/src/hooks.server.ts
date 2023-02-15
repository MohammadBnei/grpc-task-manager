import type { Handle } from '@sveltejs/kit';
import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import { ChannelCredentials } from '@grpc/grpc-js';
import {
	FieldServiceClient,
	TaskServiceClient,
	UsageServiceClient
} from '$lib/stubs/task/v1beta/task.client';
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
const taskClient = new TaskServiceClient(transport);
const fieldClient = new FieldServiceClient(transport);
const usageClient = new UsageServiceClient(transport);

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.taskClient = taskClient;
	event.locals.fieldClient = fieldClient;
	event.locals.usageClient = usageClient;

	const response = await resolve(event);

	return response;
};
