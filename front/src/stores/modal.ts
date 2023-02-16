import type { SvelteComponent } from 'svelte/internal';
import { writable } from 'svelte/store';

interface ModalComponent {
	component?: SvelteComponent;
	open: boolean;
	props?: Record<string, any>;
}

const createOpenModal = () => {
	const modalComponent = writable<ModalComponent>({
		open: false
	});

	const open = (component: SvelteComponent, props?: Record<string, any>) =>
		modalComponent.set({
			component,
			open: true,
			props
		});

	const close = () =>
		modalComponent.set({
			component: undefined,
			open: false,
			props: undefined
		});

	return {
		...modalComponent,
		open,
		close
	};
};

export default createOpenModal();
