import { writable } from 'svelte/store';
import type { TaskDto } from '../helper/taskDto';

const createTaskStore = () => {
	const taskStore = writable<TaskDto[]>([]);

	return {
		...taskStore,
		remove: (taskName: string) => {
			taskStore.update((ts) => ts.filter(({ name }) => name !== taskName));
		},
		add: (task: TaskDto) => {
			taskStore.update((ts) => [task, ...ts]);
		},
		updateOne: (task: TaskDto) => {
			taskStore.update((ts) => {
				const taskIndex = ts.findIndex(({ name }) => name === task.name);

				if (taskIndex === -1) return ts;

				ts.splice(taskIndex, 1, task);

				return ts;
			});
		}
	};
};

export const taskStore = createTaskStore();
