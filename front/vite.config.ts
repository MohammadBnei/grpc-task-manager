import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { readFileSync } from 'fs';

const config: UserConfig = {
	plugins: [sveltekit()],
	optimizeDeps: { include: ['dayjs/plugin/relativeTime.js'] },
	server: {
		https: {
			cert: readFileSync('../local/certs/front.pem'),
			key: readFileSync('../local/certs/front-key.pem')
		}
	}
};

export default config;
