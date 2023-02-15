import { taskStore } from '$src/stores/task';
import { toast } from '@zerodevx/svelte-toast';
import { showInfoToast } from './notification';

export const connectToTaskStream = () => {
	const sse = new EventSource('/task');
	sse.onmessage = (msg) => {
		try {
			const data = JSON.parse(msg.data);
			switch (data.eventType) {
				case 'create':
					taskStore.add(data.task);
					showInfoToast(`Task <strong>${data.task.name}</strong> created.`);
					break;
				case 'update':
					taskStore.updateOne(data.task);
					showInfoToast(`Task <strong>${data.task.name}</strong> updated.`);
					break;
				case 'delete':
					taskStore.remove(data.task.name);
					showInfoToast(`Task <strong>${data.task.name}</strong> deleted.`);
					break;
			}
		} catch (error) {
			console.error(error);
		}
	};
};
