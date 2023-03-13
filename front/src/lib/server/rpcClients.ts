import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import { ChannelCredentials } from '@grpc/grpc-js';
import {
	FieldServiceClient,
	TaskServiceClient,
	UsageServiceClient
} from '$lib/stubs/task/v1beta/task.client';
import fs from 'fs';
import { UserServiceClient } from '$src/lib/stubs/user/v1alpha/service.client';
import { AuthServiceClient } from '$src/lib/stubs/auth/v1alpha/service.client';
import { env } from '$env/dynamic/private';

const credentials = env.secure
	? ChannelCredentials.createSsl(
			fs.readFileSync(env.ROOT_CA as string),
			fs.readFileSync(env.FRONT_KEY as string),
			fs.readFileSync(env.FRONT_CERT as string)
	  )
	: ChannelCredentials.createInsecure();

const taskTransport = new GrpcTransport({
	host: env.TASK_API_URL as string,
	channelCredentials: credentials
});
const userTransport = new GrpcTransport({
	host: env.USER_API_URL as string,
	channelCredentials: credentials
});
const authTransport = new GrpcTransport({
	host: env.AUTH_API_URL as string,
	channelCredentials: credentials
});

export const taskClients = {
	crudClient: new TaskServiceClient(taskTransport),
	fieldClient: new FieldServiceClient(taskTransport),
	usageClient: new UsageServiceClient(taskTransport)
};

export const userClient = new UserServiceClient(userTransport);
export const authClient = new AuthServiceClient(authTransport);
