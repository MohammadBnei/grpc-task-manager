import { sse } from '$src/lib/helper/sse';
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

	return new Response()
};
