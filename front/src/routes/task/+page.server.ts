import {
	CreateTaskRequest,
	UpdateTaskRequest,
	DeleteTaskRequest
} from '$lib/stubs/task/v1alpha/task';
import { toJson, toPb } from '$src/lib/helper/taskDto';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	newTask: async ({ request, locals }) => {
		const data = await request.formData();
		const name = data.get('name') as string;
		const fields = data.get('fields') as any;
		const dueDate = data.get('dueDate') as string;

		try {
			const [time, date] = dueDate.split(' ', 2);
			const [hour, minute] = time.split(':', 2);
			const [year, month, day] = date.split('-', 3);
			console.log({ hour, minute, year, month, day });
			const createTaskRequest = CreateTaskRequest.create({
				task: toPb({ fields, name, dueDate: new Date(+year, +month - 1, +day, +hour, +minute) })
			});
			const req = await locals.client.createTask(createTaskRequest);
			const nTask = req.response;

			return { success: 200, data: { task: toJson(nTask) } };
		} catch (error: any) {
			console.error(error);
			return fail(400, { error: error?.message || 'something went wront' });
		}
	},

	updateTask: async ({ request, locals }) => {
		const data = await request.formData();
		const name = data.get('name') as string;
		const fields = data.get('fields') as any;
		const dueDate = data.get('dueDate') as string;

		try {
			const updateTaskRequest = UpdateTaskRequest.create({
				task: toPb({ fields, name, dueDate: new Date(dueDate) })
			});
			const req = await locals.client.updateTask(updateTaskRequest);
			const nTask = req.response;

			return { success: true, data: { task: toJson(nTask) } };
		} catch (error: any) {
			console.error(error);
			return fail(400, { error: error?.message || 'something went wront' });
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

			return { success: true, data: { task: toJson(nTask) } };
		} catch (error: any) {
			console.error(error);
			return fail(400, { error: error?.message || 'something went wront' });
		}
	}
};
