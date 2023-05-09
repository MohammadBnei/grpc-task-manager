import { sse } from '$src/lib/helper/sse';
import { UsingRequest, UsingStreamRequest } from '$src/lib/stubs/task/v1beta/request';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ locals }) => {
	try {
		const stream = locals.taskClients.usageClient.usingStream(UsingStreamRequest.create());

		return sse<any>(async ({ write, close }) => {
			try {
				for await (const msg of stream.responses) {
					if (msg.username) write({ data: msg });
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
	try {
		const data = await request.json();
		const usageRequest = UsingRequest.create({
			username: data.username,
			taskName: data.taskName,
			eventType: data.eventType
		});

		await locals.taskClients.usageClient.using(usageRequest);

		return new Response();
	} catch (error: any) {
		console.error(error);
		return new Response(null, {
			status: 400
		});
	}
};
