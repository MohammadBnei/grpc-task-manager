import { browser } from '$app/environment';
import { username } from '$src/stores/user';
import { get } from 'svelte/store';
import { toast } from '@zerodevx/svelte-toast';

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

export const connectToUsageStream = () => {
	const sse = new EventSource('/task/usage');
	sse.onmessage = (msg) => {
		try {
			const data = JSON.parse(msg.data);
			// switch (data.eventType) {
			// 	case 'create':
			// 		taskStore.add(data.task);
			// 		break;
			// 	case 'update':
			// 		taskStore.updateOne(data.task);
			// 		break;
			// 	case 'delete':
			// 		taskStore.remove(data.task.name);
			// 		break;
			// }
			if (browser && data.username !== get(username)) {
				toast.push(`<strong>${data.username}</strong> is modifying the ${data.taskName} task.`);
			}
		} catch (error) {
			console.error(error);
		}
	};
};
