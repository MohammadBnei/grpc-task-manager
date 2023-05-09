import { browser } from '$app/environment';
import { username } from '$src/stores/user';
import { get } from 'svelte/store';
import { showInfoToast } from './notification';
import { EventType } from '../stubs/task/v1beta/message';
import type { UsingStreamResponse } from '../stubs/task/v1beta/request';

export enum UsageEvent {
	hover = 'hover'
}

export const sendUsage = (eventType: EventType, taskName: string) =>
	fetch('/task/usage', {
		method: 'post',
		body: JSON.stringify({
			username: get(username),
			taskName,
			eventType
		})
	});

export const connectToUsageStream = () => {
	const sse = new EventSource('/task/usage');
	sse.onmessage = (msg) => {
		try {
			const data: UsingStreamResponse = JSON.parse(msg.data);
			if (browser && data.username !== get(username)) {
				switch (data.eventType) {
					case EventType.CLICK:
						showInfoToast(`<strong>${data.username}</strong> is on the ${data.taskName} task.`);
						break;
					case EventType.CREATE:
						showInfoToast(`<strong>${data.username}</strong> is creating a task.`);
						break;
					case EventType.UPDATE:
						showInfoToast(`<strong>${data.username}</strong> is updating the ${data.taskName} task.`);
						break;
					case EventType.DELETE:
						showInfoToast(`<strong>${data.username}</strong> is deleting the ${data.taskName} task.`);
						break;
				}
			}
		} catch (error) {
			console.error(error);
		}
	};
};
