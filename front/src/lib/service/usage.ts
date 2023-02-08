import { browser } from '$app/environment';
import { username } from '$src/stores/user';
import { get } from 'svelte/store';
import { toast } from '@zerodevx/svelte-toast';
import { EventType, type UsageResponse } from '../stubs/task/v1beta/task';

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
			const data: UsageResponse = JSON.parse(msg.data);
			if (browser && data.username !== get(username)) {
				switch (data.eventType) {
					case EventType.CLICK:
						toast.push(`<strong>${data.username}</strong> is on the ${data.taskName} task.`);
						break;
					case EventType.CREATE:
						toast.push(`<strong>${data.username}</strong> is creating a task.`);
						break;
					case EventType.UPDATE:
						toast.push(`<strong>${data.username}</strong> is updating the ${data.taskName} task.`);
						break;
					case EventType.DELETE:
						toast.push(`<strong>${data.username}</strong> is deleting the ${data.taskName} task.`);
						break;
				}
			}
		} catch (error) {
			console.error(error);
		}
	};
};
