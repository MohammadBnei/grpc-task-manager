import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ cookies }) => {
	const opt = {
		path: '/'
	};
	cookies.delete('jwt', opt);
	cookies.delete('user', opt);
	cookies.delete('refreshToken', opt);

	return new Response();
};
