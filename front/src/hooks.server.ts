import type {Handle} from '@sveltejs/kit';
import {authClient, mediaClient, taskClients, userClient} from '$lib/server/rpcClients';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.taskClients = taskClients;
	event.locals.userClient = userClient;
	event.locals.authClient = authClient;
	event.locals.mediaClient = mediaClient;

	return resolve(event);
};
