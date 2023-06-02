import type {Handle} from '@sveltejs/kit';
import {authClient, mediaClient, taskClients, userClient} from '$lib/server/rpcClients';
import {initializeApp} from "firebase/app";
import {firebaseConfig} from "./firebase";

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.taskClients = taskClients;
	event.locals.userClient = userClient;
	event.locals.authClient = authClient;
	event.locals.mediaClient = mediaClient;

	initializeApp(firebaseConfig);

	return resolve(event);
};
