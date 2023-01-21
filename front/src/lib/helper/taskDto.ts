import { Timestamp } from '$lib/taskService/google/protobuf/timestamp';
import { Task } from '$lib/taskService/task/v1alpha/task';

export class TaskDto {
	name: string;
	fields: any;
	dueDate?: Date;
	/**
	 *
	 */
	constructor({ name, fields, dueDate }: { name: string; fields: any; dueDate: Date | Timestamp }) {
		this.name = name;
		this.fields = fields;
		this.dueDate = Timestamp.is(dueDate) ? Timestamp.toDate(dueDate) : dueDate;
	}

	toJson() {
		return {
			name: this.name,
			fields: JSON.stringify(this.fields),
			dueDate: this.dueDate
		};
	}

	toPbTask(): Task {
		const t = this.toJson();
		return Task.create({ ...t, dueDate: Timestamp.fromDate(t.dueDate as Date) });
	}
}

export class TasksDto {
	tasks: TaskDto[];

	constructor(tasks: Task[]) {
		this.tasks = tasks.map((t) => new TaskDto(t));
	}

	toJson() {
		return this.tasks.map((t) => t.toJson());
	}
}
