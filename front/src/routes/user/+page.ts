import type { IUser } from '$src/lib/helper/userDto';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const url = new URL('/user');
	url.searchParams.set('email', 'moh@med.com');
	const res = await fetch(url);
	const user: IUser = await res.json();

	return {
		user
	};
};
