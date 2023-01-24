import { sse } from '$src/lib/helper/sse';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ locals }) => {
	const stream = locals.client.steamTasks({});

	return sse<any>(async ({ write }) => {
		for await (const msg of stream.responses) {
			if (msg.task) write({ data: msg.task });
		}
	});
};
