<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ITask } from '../../helper/taskDto';

	export let task: ITask;
	const updateTask = (data: FormData) => {
		const fieldName = data.get('fieldName') as string;
		const fieldValue = data.get('fieldValue') as string;

		const uTask = { ...task };
		uTask.fields[fieldName] = fieldValue;

		return fetch('/task', {
			method: 'post',
			body: JSON.stringify(uTask)
		});
	};
</script>

<form
	method="post"
	use:enhance={({ data, cancel, form }) => {
		cancel();
		updateTask(data).then(() => {
			form.reset();
		});
	}}
>
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
