import { TaskDto } from '$lib/helper/taskDto';
import {
	CreateTaskRequest,
	UpdateTaskRequest,
	DeleteTaskRequest
} from '$lib/stubs/task/v1alpha/task';
import type { Actions } from './$types';

export const actions: Actions = {
	newTask: async ({ request, locals }) => {
		const data = await request.formData();
		const name = data.get('name') as string;
		const fields = data.get('fields') as any;
		const dueDate = data.get('dueDate') as string;

		try {
			const createTaskRequest = CreateTaskRequest.create({
				task: new TaskDto({ fields, name, dueDate: new Date(dueDate) }).toPbTask()
			});
			const req = await locals.client.createTask(createTaskRequest);
			const nTask = req.response;

			return { success: 200, data: { task: new TaskDto(nTask).toJson() } };
		} catch (error) {
			console.error(error);
			return { success: error.status || 500, data: { error: error.message } };
		}
	},

	updateTask: async ({ request, locals }) => {
		const data = await request.formData();
		const name = data.get('name') as string;
		const fields = data.get('fields') as any;
		const dueDate = data.get('dueDate') as string;

		try {
			const updateTaskRequest = UpdateTaskRequest.create({
				task: new TaskDto({ name, fields, dueDate: new Date(dueDate) }).toPbTask()
			});
			const req = await locals.client.updateTask(updateTaskRequest);
			const nTask = req.response;

			return { success: true, data: { task: new TaskDto(nTask).toJson() } };
		} catch (error) {
			console.error(error);
			return { success: error.status || 500, data: { error: error.message } };
		}
	},

	deleteTask: async ({ request, locals }) => {
		const data = await request.formData();
		const name = data.get('name') as any;

		try {
			const deleteTaskRequest = DeleteTaskRequest.create({
				name
			});
			const req = await locals.client.deleteTask(deleteTaskRequest);
			const nTask = req.response;

			return { success: true, data: { task: new TaskDto(nTask).toJson() } };
		} catch (error) {
			console.error(error);
			return { success: error.status || 500, data: { error: error.message } };
		}
	}
};
