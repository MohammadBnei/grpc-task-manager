import { toJson, toPb } from '$lib/helper/userDto';
import type { UserServiceClient } from '$src/lib/stubs/user/v1alpha/service.client';
import { fail, type Actions } from '@sveltejs/kit';

export const actions = {
	update: async ({ locals, cookies, request }) => {
		try {
			const formData = await request.formData();
			const firstName = formData.get('firstName') as string;
			const lastName = formData.get('lastName') as string;
			const userId = formData.get('userId') as string;

			const res = await (locals.userClient as UserServiceClient).update(
				{
					lastName,
					firstName,
					id: userId
				},
				{
					meta: {
						Authorization: `Bearer ${cookies.get('jwt')}`
					}
				}
			);

			return { success: 200, data: { user: res.response.user && toJson(res.response.user) } };
		} catch (error: any) {
			console.error(error);
			return fail(error?.status || 422, { error: error?.message || 'something went wrong' });
		}
	}
} satisfies Actions;
