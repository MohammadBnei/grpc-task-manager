import {
	CreateTaskRequest,
	UpdateTaskRequest,
	DeleteTaskRequest
} from '$lib/stubs/task/v1beta/request';
import { toPb } from '$lib/helper/taskDto';
import { fail, type Actions } from '@sveltejs/kit';
import { FieldType } from '$src/lib/stubs/task/v1beta/message';
import {} from '@protobuf-ts/runtime';
import { taskClients } from '$src/lib/server/rpcClients';

export const actions: Actions = {
	newTask: async ({ request, locals, cookies }) => {
		const data = await request.formData();
		const name = data.get('name') as string;
		const dueDate = data.get('dueDate') as string;

		try {
			const [time, date] = dueDate.split(' ', 2);
			const [hour, minute] = time.split(':', 2);
			const [year, month, day] = date.split('-', 3);
			await taskClients.crudClient.createTask(
				{
					task: toPb({
						fields: [],
						name,
						dueDate: new Date(+year, +month - 1, +day, +hour, +minute)
					})
				},
				{
					meta: {
						Authorization: `Bearer ${locals.jwt}`
					}
				}
			);

			return { success: 200 };
		} catch (error: any) {
			console.error(error);
			if (error?.code === 'PERMISSION_DENIED') {
				throw new Error('Task name already exists');
			}
			return fail(400, { error: error?.message || 'something went wront' });
		}
	},

	addField: async ({ request, locals }) => {
		const data = await request.formData();
		const taskName = data.get('taskName') as string;
		const fieldName = data.get('fieldName') as string;
		const fieldValue = data.get('fieldValue') as string;

		try {
			await taskClients.fieldClient.addField({
				fieldName,
				fieldValue,
				fieldType: FieldType.STRING,
				taskName
			});

			return { success: true };
		} catch (error: any) {
			console.error(error);
			return fail(400, { error: error?.message || 'something went wront' });
		}
	},
	removeTask: async ({ request, locals }) => {
		const data = await request.formData();
		const taskName = data.get('taskName') as string;
		const fieldName = data.get('fieldName') as string;

		try {
			await taskClients.fieldClient.removeField({
				fieldName,
				taskName
			});

			return { success: true };
		} catch (error: any) {
			console.error(error);
			return fail(400, { error: error?.message || 'something went wront' });
		}
	},

	updateTask: async ({ request, locals }) => {
		const data = await request.formData();
		const stringTask = data.get('task') as string;

		try {
			const updateTaskRequest = UpdateTaskRequest.create({
				task: toPb(JSON.parse(stringTask))
			});
			await taskClients.crudClient.updateTask(updateTaskRequest);

			return { success: true };
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
			await taskClients.crudClient.deleteTask(deleteTaskRequest);

			return { success: true };
		} catch (error: any) {
			console.error(error);
			return fail(400, { error: error?.message || 'something went wront' });
		}
	}
};
