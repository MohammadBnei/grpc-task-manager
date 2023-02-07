import type { SvelteComponent } from 'svelte/internal';
import { writable } from 'svelte/store';

interface ModalComponent {
	component?: SvelteComponent;
	open: boolean;
}

const createOpenModal = () => {
	const modalComponent = writable<ModalComponent>({
		open: false
	});

	const open = (component: SvelteComponent) =>
		modalComponent.set({
			component,
			open: true
		});

	const close = () =>
		modalComponent.set({
			component: undefined,
			open: false
		});

	return {
		...modalComponent,
		open,
		close
	};
};

export default createOpenModal();
