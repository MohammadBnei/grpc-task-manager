import { toJson } from '$src/lib/helper/userDto';
import { userClient } from '$src/lib/server/rpcClients';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, locals }) => {
	const user = cookies.get('user');
	if (!user) {
		return new Response(JSON.stringify({ user: null }), { status: 401 });
	}
	const buffer = Buffer.from(user, 'base64');
	const str = buffer.toString('utf-8');
	const { email } = JSON.parse(str);

	const res = await userClient.find(
		{
			email
		} as any,
		{
			meta: {
				Authorization: `Bearer ${locals.jwt}`
			}
		}
	);

	const { user: users } = res.response;

	return new Response(JSON.stringify(toJson(users?.[0])));
};
