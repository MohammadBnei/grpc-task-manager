<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ITask } from '../../helper/taskDto';

	export let task: ITask;
</script>

<form
	method="post"
	use:enhance={({ data, cancel, form }) => {
		cancel();
		const fieldName = data.get('fieldName');
		const fieldValue = data.get('fieldValue');

		const uTask = {
			...task,
			fields: {
				...task.fields,
				[fieldName]: fieldValue
			}
		};

		fetch('/task', {
			method: 'post',
			body: JSON.stringify(uTask)
		}).then(() => {
			form.reset();
		});
	}}
>
	<input
		class="mt-1 py-4 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input px-1"
		name="fieldName"
		placeholder="new field name"
		required
	/>
	<input
		class="mt-1 py-4 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input px-1"
		name="fieldValue"
		placeholder="new field value"
		required
	/>
	<button
		type="submit"
		class="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-yellow-600 border border-transparent rounded-lg active:bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:shadow-outline-yellow"
	>
		+
	</button>
</form>
