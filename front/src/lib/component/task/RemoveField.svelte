<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ITask } from '../../helper/taskDto';

	export let task: ITask;
	export let fieldToRemove = '';
</script>

<form
	method="post"
	use:enhance={({ cancel, form }) => {
		cancel();
		const uTask = { ...task };
		delete uTask.fields[fieldToRemove];

		fetch('/task', {
			method: 'post',
			body: JSON.stringify(uTask)
		}).then(() => {
			form.reset();
		});
	}}
>
	<button class="btn btn-xs btn-circle btn-warning">-</button>
</form>
