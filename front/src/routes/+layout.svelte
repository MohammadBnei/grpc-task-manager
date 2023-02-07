<script lang="ts">
	import '../app.css';
	import Header from '$src/lib/component/Header.svelte';
	import Modal from '$src/lib/component/modal.svelte';
</script>

<div class="w-full pt-2 px-2 bg-neutral min-h-screen">
	<Header />
	<div class="m-2">
		<slot />
	</div>
	<Modal />
</div>
