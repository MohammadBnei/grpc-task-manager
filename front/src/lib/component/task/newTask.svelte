<script>
	import { enhance } from '$app/forms';
	import modal from '$src/stores/modal';
	import SveltyPicker from 'svelty-picker';
	import FormError from '../FormError.svelte';

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
	<FormError {error} />
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
