<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ITask } from '../../helper/taskDto';
	import FormError from '../FormError.svelte';

	let error = '';
	export let task: ITask;
</script>

<form
	method="post"
	action="/task?/addField"
	use:enhance={({ data, form }) => {
		data.append('taskName', task.name);

		return ({ result }) => {
			if (result.type === 'success') {
				form.reset();
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
			<input type="text" class="input input-bordered" name="fieldName" required />
		</label>
		<label class="input-group input-group-sm my-2">
			<span class="w-24 p-2">Value</span>
			<input type="text" class="input input-bordered" name="fieldValue" required />
		</label>
	</div>
	<button class="btn btn-xs btn-info">Create Field</button>
</form>
