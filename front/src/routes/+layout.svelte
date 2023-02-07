<script lang="ts">
	import '../app.css';
	import Header from '$src/lib/component/Header.svelte';
	import Modal from '$src/lib/component/modal.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import Footer from '$src/lib/component/Footer.svelte';
</script>

<Header />
<div class="hero min-h-screen bg-base-200 overflow-x-auto">
	<slot />
</div>
<Footer />

<SvelteToast />
<Modal />
