import type { Task } from '$src/lib/stubs/task/v1alpha/task';
import { writable } from 'svelte/store';
import { toJson, type ITask } from '../lib/helper/taskDto';

const createTaskStore = () => {
	const taskStore = writable<ITask[]>([]);

	return {
		...taskStore,
		remove: (taskName: string) => {
			taskStore.update((ts) => ts.filter(({ name }) => name !== taskName));
		},
		add: (task: Task) => {
			taskStore.update((ts) => [toJson(task), ...ts]);
		},
		updateOne: (task: Task) => {
			taskStore.update((ts) => {
				const taskIndex = ts.findIndex(({ name }) => name === task.name);

				if (taskIndex === -1) return ts;

				ts.splice(taskIndex, 1, toJson(task));

				return ts;
			});
		}
	};
};

export const taskStore = createTaskStore();
