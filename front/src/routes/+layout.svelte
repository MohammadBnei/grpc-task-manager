<script lang="ts">
	import '../app.css';
	import Header from '$src/lib/component/Header.svelte';
	import Modal from '$src/lib/component/Modal.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import Footer from '$src/lib/component/Footer.svelte';
	import { muteToast } from '$src/stores/user';

	let headerHeight = 0;
</script>

<div class="sticky top-0 z-10">
	<Header bind:headerHeight />
</div>
<div class="hero bg-base-200" style="min-height: calc(100vh - {headerHeight}px);">
	<div class="px-2 w-full">
		<slot />
	</div>
</div>
<Footer />

{#if !$muteToast}
	<SvelteToast />
{/if}
<Modal />
