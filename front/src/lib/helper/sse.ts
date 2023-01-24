type Chunk<T> = { event?: string; id?: string | number; data: T };

export interface SSEResponseOptions extends ResponseInit {
	retry?: number;
}

export interface SSE<T> {
	write(chunk: Chunk<T>): Promise<boolean>;
	close(): Promise<void>;
	onClose(cb: () => void | Promise<void>): void;
}

export function sse<T>(
	run: (sse: SSE<T>) => Promise<void> | (() => void),
	options: SSEResponseOptions = {}
) {
	return new SSEResponse(run, options);
}

export class SSEResponse<T> extends Response {
	constructor(
		run: (sse: SSE<T>) => Promise<void> | (() => void),
		{ retry, headers, status, statusText }: SSEResponseOptions = {}
	) {
		let open = true;
		const { readable, writable } = new TransformStream<Chunk<T>, string>({
			start: (controller) => {
				if (retry && retry > 0) controller.enqueue(`retry: ${retry}\n\n`);
			},
			transform: ({ event, id, data }, controller) => {
				let msg = '';

				// id
				if (id) msg += `id: ${id}\n`;
				// event
				if (event) msg += `event: ${event}\n`;
				// data
				if (typeof data === 'string') {
					msg += 'data: ' + data.trim().replace(/\n+/gm, '\ndata: ') + '\n';
				} else {
					msg += `data: ${JSON.stringify(data)}\n`;
				}
				controller.enqueue(msg + '\n');
			}
		});
		const writer = writable.getWriter();

		const closePromise = writer.closed
			.then(() => {
				typeof cleanup === 'function' && cleanup();
			})
			.catch(() => {
				/* request aborted, do nothing */
			})
			.finally(() => {
				open = false;
			});

		const cleanup = run({
			async write(chunk) {
				if (!open) return false;
				await writer.write(chunk);
				return true;
			},
			async close() {
				if (!open) return;
				writer.releaseLock();
				await writable.close();
			},
			onClose(cb) {
				closePromise.then(() => {
					cb();
				});
			}
		});

		headers = new Headers(headers);
		if (!headers.has('Cache-Control')) {
			headers.set('Cache-Control', 'no-cache');
		}
		headers.set('Content-Type', 'text/event-stream');

		super(readable, {
			headers,
			status,
			statusText
		});
	}
}
