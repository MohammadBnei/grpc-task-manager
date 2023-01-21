import type { PageServerLoad } from './$types';
import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import { ChannelCredentials } from '@grpc/grpc-js';
import { TaskServiceClient } from '../lib/taskService/task/v1alpha/task.client';
import { ListTasksRequest, Task } from '../lib/taskService/task/v1alpha/task';
import { Timestamp } from '$lib/taskService/google/protobuf/timestamp';

export const load = (async () => {
	const transport = new GrpcTransport({
		host: 'localhost:4000',
		channelCredentials: ChannelCredentials.createInsecure()
	});
	const client = new TaskServiceClient(transport);
	const tasks = await (await client.listTasks(ListTasksRequest.create()).response).tasks;

	return {
		tasks: tasks.map((t) => ({
			name: t.name,
			fields: t.fields,
			dueDate: t.dueDate && Timestamp.toDate(t.dueDate)
		}))
	};
}) satisfies PageServerLoad;
