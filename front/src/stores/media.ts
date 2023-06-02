import { writable } from 'svelte/store';
import type {IMedia} from "../lib/helper/mediaDto";
import type {Media} from "../lib/stubs/media/v1alpha/media";

const xor = (cond: boolean, asc: boolean) => {
	return (cond && !asc) || (!cond && asc);
};

const createMediaStore = () => {
	const mediaStore = writable<IMedia[]>([]);

	return {
		...mediaStore,
		sortByName: (asc = true) =>
			mediaStore.update((ts) =>
				ts.sort((a, b) =>
					xor(a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase(), asc) ? 1 : -1
				)
			),
		remove: (mediaName: string) => {
			mediaStore.update((ts) => ts.filter(({ name }) => name !== mediaName));
		},
		add: (media: Media) => {
			mediaStore.update((ts) => [toJson(media), ...ts]);
		},
		updateOne: (media: Media) => {
			mediaStore.update((ts) => {
				const mediaIndex = ts.findIndex(({ name }) => name === media.name);

				if (mediaIndex === -1) return ts;

				ts.splice(mediaIndex, 1, toJson(media));

				return ts;
			});
		}
	};
};

export const mediaStore = createMediaStore();
export const relativeDate = writable(true);
export const searchTerm = writable('');
function toJson(media: Media): IMedia {
    throw new Error('Function not implemented.');
}

