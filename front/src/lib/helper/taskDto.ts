import { Task } from '$lib/stubs/task/v1alpha/task';

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
		dueDate: typeof task.dueDate === 'string' ? task.dueDate : task.dueDate?.toDateString(),
		fields: JSON.stringify(task.fields || {})
	});
