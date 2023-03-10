import type { Handle } from '@sveltejs/kit';
import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import { ChannelCredentials } from '@grpc/grpc-js';
import {
	FieldServiceClient,
	TaskServiceClient,
	UsageServiceClient
} from '$lib/stubs/task/v1beta/task.client';
import fs from 'fs';
import dotenv from 'dotenv';
import { UserServiceClient } from '$src/lib/stubs/user/v1alpha/service.client';
import { AuthServiceClient } from '$src/lib/stubs/auth/v1alpha/service.client';

process.env.NODE_ENV !== 'production' && dotenv.config();

const credentials = process.env.secure
	? ChannelCredentials.createSsl(
			fs.readFileSync(process.env.ROOT_CERT as string),
			fs.readFileSync(process.env.FRONT_KEY as string),
			fs.readFileSync(process.env.FRONT_CERT as string)
	  )
	: ChannelCredentials.createInsecure();

const taskTransport = new GrpcTransport({
	host: process.env.TASK_API_URL as string,
	channelCredentials: credentials
});
const userTransport = new GrpcTransport({
	host: process.env.USER_API_URL as string,
	channelCredentials: credentials
});
const authTransport = new GrpcTransport({
	host: process.env.AUTH_API_URL as string,
	channelCredentials: credentials
});
const taskClients = {
	crudClient: new TaskServiceClient(taskTransport),
	fieldClient: new FieldServiceClient(taskTransport),
	usageClient: new UsageServiceClient(taskTransport)
};

const userClient = new UserServiceClient(userTransport);
const authClient = new AuthServiceClient(authTransport);

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.taskClients = taskClients;
	event.locals.userClient = userClient;
	event.locals.authClient = authClient;

	const response = await resolve(event);

	return response;
};
