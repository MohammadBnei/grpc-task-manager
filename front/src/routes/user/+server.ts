import { toJson } from '$src/lib/helper/userDto';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, locals, url }) => {
	const email = url.searchParams.get('email');
	const res = await locals.userClient.find(
		{
			email
		} as any,
		{
			meta: {
				Authorization: `Bearer ${cookies.get('jwt')}`
			}
		}
	);

	const { user: users } = res.response;

	return new Response(JSON.stringify(toJson(users?.[0])));
};
