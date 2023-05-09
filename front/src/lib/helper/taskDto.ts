import { FieldType, Task } from '$lib/stubs/task/v1beta/message';

export interface ITask {
	id: string;
	name: string;
	fields: IField[];
	dueDate: Date;
}

export interface IField {
	name: string;
	value: string;
	type: FieldType;
}

export const toJson = (task: Task): ITask => {
	return {
		id: task.id,
		name: task.name,
		fields: task.fields.map(({ name, value, type }) => ({ name, value, type })),
		dueDate: new Date(task.dueDate)
	};
};

export const toPb = (task: ITask) =>
	Task.create({
		...task,
		dueDate: typeof task.dueDate === 'string' ? task.dueDate : task.dueDate?.toISOString()
	});
