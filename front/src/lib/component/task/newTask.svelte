<script>
	import { enhance } from '$app/forms';
	import modal from '$src/stores/modal';
	import SveltyPicker from 'svelty-picker';

	let error = '';
</script>

<form
	action="/task?/newTask"
	method="POST"
	use:enhance={() => {
		return async ({ result }) => {
			if (result.type === 'success') {
				modal.close();
				return;
			}
			error = result.data?.error;
		};
	}}
>
	{#if error}
		<div class="alert alert-error shadow-lg">
			<div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="stroke-current flex-shrink-0 h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
					/></svg
				>
				<span>{error}</span>
			</div>
		</div>
	{/if}
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<div class="form-control">
		<label class="input-group input-group-sm my-2">
			<span class="w-24 p-2">Name</span>
			<input type="text" class="input input-bordered" name="name" required />
		</label>
		<label class="input-group input-group-sm my-2">
			<span class="w-24 p-2">Due Date</span>
			<SveltyPicker
				inputClasses="input input-bordered"
				format="hh:ii yyyy-mm-dd"
				name="dueDate"
				startDate={new Date()}
			/>
		</label>
	</div>
	<button class="btn btn-info btn-xs"> Create Task </button>
</form>
