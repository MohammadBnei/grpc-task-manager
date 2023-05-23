import { toast } from '@zerodevx/svelte-toast';
import InfoToast from '../component/toast/InfoToast.svelte';

export const showInfoToast = (text: string) => {
	toast.push({
		component: {
			src: InfoToast as any,
			props: {
				text
			},
			sendIdTo: 'toastId'
		},
		theme: {
			'--toastPadding': '0',
			'--toastMsgPadding': '0',
			'--toastBarHeight': '0',
			'--toastBtnWidth': '0',
			'--toastBtnHeight': '0',
			'--toastItemWidth': '0',
			'--toastItemHeight': '0',
			'--toastBtnContent': '',
			'--toastBackground': 'rgba(0,0,0,0);'
		}
	});
};
