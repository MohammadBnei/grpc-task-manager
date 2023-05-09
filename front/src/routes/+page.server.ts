import type { PageServerLoad } from './$types';
import { ListTasksRequest } from '$lib/stubs/task/v1beta/request';
import { toJson } from '$src/lib/helper/taskDto';

export const load: PageServerLoad = async ({ locals }) => {
	const listTaskRequest = ListTasksRequest.create();
	const request = await locals.taskClients.crudClient.listTasks(listTaskRequest);
	const listTasksResponse = request.response;

	const tasks = listTasksResponse.tasks.map(toJson);

	return {
		tasks
	};
};
