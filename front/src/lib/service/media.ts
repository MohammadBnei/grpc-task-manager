import { showInfoToast } from './notification';
import {mediaStore} from "../../stores/media";

export const connectToMediaStream = () => {
	const sse = new EventSource('/media');
	sse.onmessage = (msg) => {
		try {
			const data = JSON.parse(msg.data);
			switch (data.eventType) {
				case 'create':
					mediaStore.add(data.media);
					showInfoToast(`Media <strong>${data.media.name}</strong> created.`);
					break;
				case 'update':
					mediaStore.updateOne(data.media);
					showInfoToast(`Media <strong>${data.media.name}</strong> updated.`);
					break;
				case 'delete':
					mediaStore.remove(data.media.name);
					showInfoToast(`Media <strong>${data.media.name}</strong> deleted.`);
					break;
			}
		} catch (error) {
			console.error(error);
		}
	};
};
