import adapter from '@sveltejs/adapter-auto';
import nodeAdapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: process.env.adapter === 'node' ? nodeAdapter() : adapter(),
		alias: {
			$src: './src',
			$stores: './src/stores'
		},
		csrf: {
			checkOrigin: false
		}
	}
};

export default config;
