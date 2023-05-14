import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ depends, fetch }) => {
	depends('auth');
	try {
		const res = await fetch('/auth/refresh');
		if (!res.ok) throw new Error();
		const user = await res.json();

		if (!user) return {};

		return {
			user
		};
	} catch (error) {
		console.debug(error);
		await fetch('/auth/refresh', { method: 'DELETE' });
		return {
			user: null
		};
	}
};
