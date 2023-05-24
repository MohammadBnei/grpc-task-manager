<script lang="ts">
	import modal from '$stores/modal';
	import Portal from 'svelte-portal';

	$: props = $modal.props || {};
</script>

<Portal target="body">
	<input type="checkbox" id="modal" class="modal-toggle" checked={$modal.open} />
	<div class="modal">
		<div class="modal-box">
			<svelte:component this={$modal.component} {...props} />
			<div class="modal-action">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<label for="modal" class="btn" on:click|preventDefault={modal.close}>Close</label>
			</div>
		</div>
	</div>
</Portal>
