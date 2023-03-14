import type { IUser } from '$src/lib/helper/userDto';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch('/user');
	const user: IUser = await res.json();

	return {
		user
	};
};
