import { sse } from '$src/lib/helper/sse';
import { toPb } from '$src/lib/helper/taskDto';
import {
	StreamTasksRequest,
	StreamTasksResponse,
	UpdateTaskRequest
} from '$lib/stubs/task/v1beta/request';
import type { RequestHandler } from './$types';
import type { ServerStreamingCall } from '@protobuf-ts/runtime-rpc';
import { taskClients } from '$src/lib/server/rpcClients';

export const GET: RequestHandler = ({ locals }) => {
	try {
		const stream: ServerStreamingCall<StreamTasksRequest, StreamTasksResponse> =
			taskClients.crudClient.streamTasks({});

		return sse<any>(async ({ write, close }) => {
			try {
				for await (const msg of stream.responses) {
					if (msg.task) write({ data: msg });
				}
			} catch (error) {
				close();
			}
		});
	} catch (error) {
		console.error(error);
	}

	return new Response();
};

export const POST: RequestHandler = async ({ locals, request }) => {
	const data = await request.json();

	try {
		const updateTaskRequest = UpdateTaskRequest.create({
			task: toPb(data)
		});
		await taskClients.crudClient.updateTask(updateTaskRequest);

		return new Response();
	} catch (error: any) {
		console.error(error);
		return new Response(null, {
			status: 400
		});
	}
};
