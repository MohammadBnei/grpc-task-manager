import type { PageServerLoad } from './$types';
import { ListTasksRequest } from '$lib/taskService/task/v1alpha/task';
import { TasksDto } from '$lib/helper/taskDto';

export const load: PageServerLoad = async ({ locals }) => {
	const listTaskRequest = ListTasksRequest.create();
	const request = await locals.client.listTasks(listTaskRequest);
	const listTasksResponse = request.response;

	const tasks = new TasksDto(listTasksResponse.tasks).toJson();

	return {
		tasks
	};
};
