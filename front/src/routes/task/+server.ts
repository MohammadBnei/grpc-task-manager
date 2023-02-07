import { sse } from '$src/lib/helper/sse';
import { toJson, toPb } from '$src/lib/helper/taskDto';
import { UpdateTaskRequest, UsageRequest } from '$lib/stubs/task/v1alpha/task';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ locals }) => {
	try {
		const stream = locals.client.streamTasks({});

		return sse<any>(async ({ write }) => {
			for await (const msg of stream.responses) {
				if (msg.task) write({ data: msg });
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
		await locals.client.updateTask(updateTaskRequest);

		return new Response();
	} catch (error: any) {
		console.error(error);
		return new Response(null, {
			status: 400
		});
	}
};

export const PUT: RequestHandler = async ({ locals, request }) => {
	try {
		const data = await request.json();
		const usageRequest = UsageRequest.create({
			username: data.username,
			taskName: data.taskName
		});
		console.log({ usageRequest });

		await locals.client.using(usageRequest);

		return new Response();
	} catch (error: any) {
		console.error(error);
		return new Response(null, {
			status: 400
		});
	}
};
