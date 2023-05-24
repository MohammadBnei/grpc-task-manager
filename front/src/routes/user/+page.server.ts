import { toJson } from '$lib/helper/userDto';
import { userClient } from '$src/lib/server/rpcClients';
import { fail, type Actions } from '@sveltejs/kit';

export const actions = {
	update: async ({ locals, request }) => {
		try {
			const formData = await request.formData();
			const firstName = formData.get('firstName') as string;
			const lastName = formData.get('lastName') as string;
			const userId = formData.get('userId') as string;

			const res = await userClient.update(
				{
					lastName,
					firstName,
					id: userId
				},
				{
					meta: {
						Authorization: `Bearer ${locals.jwt}`
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
