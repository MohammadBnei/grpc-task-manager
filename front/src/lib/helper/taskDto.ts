import { browser } from '$app/environment';
import { Task } from '$lib/stubs/task/v1alpha/task';
import { taskStore } from '$src/stores/task';
import { username } from '$src/stores/user';
import { toast } from '@zerodevx/svelte-toast';
import { get } from 'svelte/store';

export interface ITask {
	name: string;
	fields: Record<string, unknown>;
	dueDate: Date;
}

export const toJson = (task: Task): ITask => {
	try {
		return {
			name: task.name,
			fields: JSON.parse(task.fields) || {},
			dueDate: new Date(task.dueDate)
		};
	} catch (error) {
		return {
			name: task.name,
			fields: {},
			dueDate: new Date(task.dueDate)
		};
	}
};

export const toPb = (task: ITask) =>
	Task.create({
		name: task.name,
		dueDate: typeof task.dueDate === 'string' ? task.dueDate : task.dueDate?.toISOString(),
		fields: JSON.stringify(task.fields || {})
	});

export const connectToTaskStream = () => {
	const sse = new EventSource('/task');
	sse.onmessage = (msg) => {
		try {
			const data = JSON.parse(msg.data);
			switch (data.eventType) {
				case 'create':
					taskStore.add(data.task);
					break;
				case 'update':
					taskStore.updateOne(data.task);
					break;
				case 'delete':
					taskStore.remove(data.task.name);
					break;
			}
		} catch (error) {
			console.error(error);
		}
	};
};

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
