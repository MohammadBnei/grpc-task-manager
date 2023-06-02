import {
	CreateTaskRequest,
	UpdateTaskRequest,
	DeleteTaskRequest,
	FieldType
} from '$lib/stubs/task/v1beta/task';
import { toPb } from '$lib/helper/taskDto';
import { fail, type Actions } from '@sveltejs/kit';
import {getStorage, ref, uploadBytes, listAll, deleteObject} from "firebase/storage";
import {MediaRequest} from "../../lib/stubs/media/v1alpha/media";
import slugify from "slugify";

export const actions: Actions = {
	newTask: async ({ request, locals, cookies }) => {
		const data = await request.formData();
		const name = data.get('name') as string;
		const dueDate = data.get('dueDate') as string;

		try {
			const [time, date] = dueDate.split(' ', 2);
			const [hour, minute] = time.split(':', 2);
			const [year, month, day] = date.split('-', 3);
			const createTaskRequest = CreateTaskRequest.create({
				task: toPb({ fields: [], name, dueDate: new Date(+year, +month - 1, +day, +hour, +minute) })
			});
			await locals.taskClients.crudClient.createTask(createTaskRequest, {
				meta: {
					Authorization: `Bearer ${cookies.get('jwt')}`
				}
			});

			return { success: 200 };
		} catch (error: any) {
			console.error(error);
			return fail(400, { error: error?.message || 'something went wront' });
		}
	},

	addField: async ({ request, locals }) => {
		const data = await request.formData();
		const taskName = data.get('taskName') as string;
		const fieldName = data.get('fieldName') as string;
		const fieldValue = data.get('fieldValue') as string;
		const media = data.get('fileMedia') as File;

		try {
			await locals.taskClients.fieldClient.addField({
				fieldName,
				fieldValue,
				fieldType: FieldType.STRING,
				taskName
			});
		} catch (error: any) {
			console.error(error);
			return fail(400, { error: error?.message || 'something went wront' });
		}

		if (!media) return { success: true };
		const mediaPath = `/media/${slugify(taskName)}/${slugify(fieldName)}/${media.name}`;

		// try {
		// 	const createMediaRequest = MediaRequest.create({
		// 		link: mediaPath,
		// 		name: media.name,
		// 		taskId: taskName,
		// 		type: media.type
		// 	});
		//
		// 	await locals.mediaClient.createMedia(createMediaRequest);
		// } catch (error: any) {
		// 	console.error(error);
		// 	return fail(400, { error: error?.message || 'something went wront' });
		// }

		const storage = getStorage();
		const storageRef = ref(storage, mediaPath);

		try {
			await uploadBytes(storageRef, await media.arrayBuffer());
			return { success: true };
		} catch (error: any) {
			console.error(error);
			return fail(500, { error: error?.message || 'something went wront' });
		}
	},
	removeTask: async ({ request, locals }) => {
		const data = await request.formData();
		const taskName = data.get('taskName') as string;
		const fieldName = data.get('fieldName') as string;

		const mediaPath = `/media/${slugify(taskName)}/${slugify(fieldName)}`;
		const listRef = ref(getStorage(), mediaPath);
		const listResult = await listAll(listRef);

		for (const item of listResult.items) {
			const itemRef = ref(getStorage(), item.fullPath);
			deleteObject(itemRef).then(() => {
				// File deleted successfully
			}).catch((error) => {
				console.error(error);
			});

			// try {
			// 	const deleteMediaRequest = MediaRequest.create({
			// 		link: item.fullPath
			// 	})
			// 	await locals.mediaClient.deleteMedia(deleteMediaRequest);
			// } catch (error: any) {
			// 	console.error(error);
			// 	return fail(500, { error: error?.message || 'something went wront' });
			// }
		}

		try {
			await locals.taskClients.fieldClient.removeField({
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
			await locals.taskClients.crudClient.updateTask(updateTaskRequest);

			return { success: true };
		} catch (error: any) {
			console.error(error);
			return fail(400, { error: error?.message || 'something went wront' });
		}
	},

	deleteTask: async ({ request, locals }) => {
		const data = await request.formData();
		const name = data.get('name') as any;
		const mediaPath = `/media/${slugify(name)}`;
		const listRef = ref(getStorage(), mediaPath);
		const listResult = await listAll(listRef);

		for (const item of listResult.items) {
			const itemRef = ref(getStorage(), item.fullPath);
			deleteObject(itemRef).then(() => {
				// File deleted successfully
			}).catch((error) => {
				console.error(error);
			});

			// try {
			// 	const deleteMediaRequest = MediaRequest.create({
			// 		link: item.fullPath
			// 	})
			// 	await locals.mediaClient.deleteMedia(deleteMediaRequest);
			// } catch (error: any) {
			// 	console.error(error);
			// 	return fail(500, { error: error?.message || 'something went wront' });
			// }
		}
		for (const folder of listResult.prefixes) {
			const folderRef = ref(getStorage(), folder.fullPath);
			const folderResult = await listAll(folderRef);
			for (const item of folderResult.items) {
				const itemRef = ref(getStorage(), item.fullPath);
				deleteObject(itemRef).then(() => {
					// File deleted successfully
				}).catch((error) => {
					console.error(error);
				});

				// try {
				// 	const deleteMediaRequest = MediaRequest.create({
				// 		link: item.fullPath
				// 	})
				// 	await locals.mediaClient.deleteMedia(deleteMediaRequest);
				// } catch (error: any) {
				// 	console.error(error);
				// 	return fail(500, { error: error?.message || 'something went wront' });
				// }
			}
		}

		try {
			const deleteTaskRequest = DeleteTaskRequest.create({
				name
			});
			await locals.taskClients.crudClient.deleteTask(deleteTaskRequest);

			return { success: true };
		} catch (error: any) {
			console.error(error);
			return fail(400, { error: error?.message || 'something went wront' });
		}
	}
};
