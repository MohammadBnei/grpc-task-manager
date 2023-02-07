import { username } from '$src/stores/user';
import { get } from 'svelte/store';

export enum UsageEvent {
	hover = 'hover'
}

export const sendUsage = (eventType: UsageEvent, taskName: string) =>
	fetch('/task', {
		method: 'put',
		body: JSON.stringify({
			username: get(username),
			taskName,
			eventType
		})
	});
