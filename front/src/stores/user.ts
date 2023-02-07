import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const createUsernameStore = () => {
	const username = writable('');

	if (browser) {
		username.set(localStorage.getItem('username') || '');
	}

	return {
		...username,
		set: (name: string) => {
			if (browser) {
				localStorage.setItem('username', name);
			}
			username.set(name);
		}
	};
};

export const username = createUsernameStore();
export const muteToast = writable(false)
