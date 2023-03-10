import { fail } from '@sveltejs/kit';
import type { Actions } from '../$types';

export const actions: Actions = {
	login: async ({ request, locals }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		if (email === 'moha@med.com' && password === 'test') return { success: 200 };

		return fail(400, { error: 'you not me' });
	},
	register: async ({ request, locals }) => {
		const data = await request.formData();
		const email = data.get('email');
		const firstName = data.get('firstName');
		const lastName = data.get('lastName');
		const password = data.get('password');

		if (email && password && firstName === 'moha' && lastName) return { success: 200 };

		return fail(400, { error: 'you not me' });
	}
};
