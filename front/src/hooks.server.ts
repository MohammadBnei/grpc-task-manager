import '$lib/server/tracing';
import type { Handle } from '@sveltejs/kit';
import { authClient } from '$lib/server/rpcClients';
import winstonLogger from './lib/server/winston.logger';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.jwt = event.cookies.get('jwt');

	const requestClone = event.request.clone();
	let response = await resolve(event);

	const rt = event.cookies.get('refreshToken');
	if (response.status === 500 && rt) {
		try {
			const res = await authClient.refreshToken({
				ip: '10.10.10.10',
				refreshToken: rt
			});

			event.locals.jwt = res.response.jwt;
			event.request = requestClone;

			response = await resolve(event);

			response.headers.append('Set-Cookie', 'jwt=' + res.response.jwt);
		} catch (error) {
			winstonLogger.debug(error);
		}
	}

	return response;
};
