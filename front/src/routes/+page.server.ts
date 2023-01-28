import type { PageServerLoad } from './$types';
import { ListTasksRequest } from '$lib/stubs/task/v1alpha/task';
import { TasksDto } from '$lib/helper/taskDto';

export const load: PageServerLoad = async ({ locals, depends }) => {
	const listTaskRequest = ListTasksRequest.create();
	const request = await locals.client.listTasks(listTaskRequest);
	const listTasksResponse = request.response;

	const tasks = new TasksDto(listTasksResponse.tasks.reverse()).toJson();
	depends('task');
	
	return {
		tasks
	};
};
