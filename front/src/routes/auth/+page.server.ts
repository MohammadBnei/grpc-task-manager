import { LoginResponse_STATUS } from '$src/lib/stubs/auth/v1alpha/message';
import { fail } from '@sveltejs/kit';
import type { Actions } from '../$types';

export const actions: Actions = {
	login: async ({ request, locals, cookies }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		if ([email, password].includes(null)) {
			return fail(400, { error: 'You must specify all the fields' });
		}

		try {
			const { response } = await locals.authClient.login({
				email: email as string,
				password: password as string,
				ip: '10.10.10.10'
			});

			switch (response.status) {
				case LoginResponse_STATUS.OK: {
					cookies.set('jwt', response.jwt, {
						path: '/'
					});
					cookies.set('refreshToken', response.refreshToken, {
						path: '/'
					});
					const buffer = Buffer.from(
						JSON.stringify(response.user, (_, v) => (typeof v === 'bigint' ? v.toString() : v)),
						'utf-8'
					);
					const base64 = buffer.toString('base64');
					cookies.set('user', base64, {
						path: '/'
					});
					return { success: true };
				}
				case LoginResponse_STATUS.NOT_FOUND:
					return fail(400, { error: email + ' not found' });
				case LoginResponse_STATUS.WRONG_PASSWORD:
					return fail(400, { error: 'wrong password' });
				case LoginResponse_STATUS.INTERNAL:
					return fail(400, { error: 'something went wrong' });
				default:
					break;
			}
		} catch (error: any) {
			return fail(400, { error: error?.message || 'something went wrong' });
		}
	},
	register: async ({ request, locals }) => {
		const data = await request.formData();
		const email = data.get('email');
		const firstName = data.get('firstName');
		const lastName = data.get('lastName');
		const password = data.get('password');

		if ([email, firstName, lastName, password].includes(null)) {
			return fail(400, { error: 'You must specify all the fields' });
		}

		try {
			await locals.userClient.register({
				email: email as string,
				firstName: firstName as string,
				lastName: lastName as string,
				password: password as string
			});
			return { success: true };
		} catch (error: any) {
			return fail(400, { error: error?.message || 'something went wrong' });
		}
	}
};
