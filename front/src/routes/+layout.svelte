<script lang="ts">
	import '../app.css';
	import Header from '$src/lib/component/Header.svelte';
	import Modal from '$src/lib/component/modal.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import Footer from '$src/lib/component/Footer.svelte';
	import { muteToast } from '$src/stores/user';

	let headerHeight = 0;

	$: console.log({ headerHeight });
</script>

<Header bind:headerHeight />
<div class="hero bg-base-200 overflow-x-auto" style="min-height: calc(100vh - {headerHeight}px);">
	<slot />
</div>
<Footer />

{#if !$muteToast}
	<SvelteToast />
{/if}
<Modal />
