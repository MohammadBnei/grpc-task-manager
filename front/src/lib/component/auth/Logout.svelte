<script lang="ts">
	import { invalidate } from '$app/navigation';
	import modal from '$src/stores/modal';

	export let inModal = false;

	const logout = async () => {
		await fetch('/auth/logout');
		invalidate('auth');
		inModal && modal.close();
	};
</script>

<div class="flex justify-center items-center">
	<button class="btn btn-xs btn-warning" on:click={logout}>Are you sure ?</button>
</div>
