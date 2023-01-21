import { TaskDto } from '$lib/helper/taskDto';
import { CreateTaskRequest } from '$lib/taskService/task/v1alpha/task';
import type { Actions } from './$types';

export const actions: Actions = {
	newTask: async ({ request, locals }) => {
		const data = await request.formData();
		const name = data.get('name') as string;
		const fields = data.get('fields') as any;
		const dueDate = data.get('dueDate') as string;

		const createTaskRequest = CreateTaskRequest.create({
			task: new TaskDto({ fields, name, dueDate: new Date(dueDate) }).toPbTask()
		});
		const req = await locals.client.createTask(createTaskRequest);
		const nTask = req.response;

		return { success: true, data: { task: nTask } };
	}
};
