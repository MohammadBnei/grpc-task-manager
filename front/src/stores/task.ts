import type { Task } from '$src/lib/stubs/task/v1beta/message';
import { writable } from 'svelte/store';
import { toJson, type ITask } from '../lib/helper/taskDto';

const xor = (cond: boolean, asc: boolean) => {
	if ((cond && !asc) || (!cond && asc)) {
		return true;
	} else {
		return false;
	}
};

const createTaskStore = () => {
	const taskStore = writable<ITask[]>([]);

	return {
		...taskStore,
		sortByDate: (asc = true) =>
			taskStore.update((ts) => ts.sort((a, b) => (xor(a.dueDate < b.dueDate, asc) ? 1 : -1))),
		sortByName: (asc = true) =>
			taskStore.update((ts) =>
				ts.sort((a, b) =>
					xor(a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase(), asc) ? 1 : -1
				)
			),
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
export const relativeDate = writable(true);
export const searchTerm = writable('');
