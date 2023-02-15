<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ITask } from '../../helper/taskDto';

	export let task: ITask;
	export let fieldToRemove = '';
</script>

<form
	method="post"
	action="/task?/removeTask"
	use:enhance={({ data }) => {
		data.append('taskName', task.name);
		data.append('fieldName', fieldToRemove);
	}}
>
	<button class="btn btn-xs btn-circle btn-warning">-</button>
</form>
