import { sse } from '$src/lib/helper/sse';
import { UsageRequest } from '$src/lib/stubs/task/v1alpha/task';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ locals }) => {
	try {
		const stream = locals.client.usingStream(UsageRequest.create());

		return sse<any>(async ({ write }) => {
			for await (const msg of stream.responses) {
				if (msg.username) write({ data: msg });
			}
		});
	} catch (error) {
		console.error(error);
	}

	return new Response();
};
