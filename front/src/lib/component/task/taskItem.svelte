<script lang="ts">
	import { enhance } from '$app/forms';
	import Time from 'svelte-time';
	import type { ITask } from '../../helper/taskDto';
	import NewField from './newField.svelte';

	export let task: ITask;

	$: fields = Object.entries(task.fields);
</script>

<div class="p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
	<div class="flex justify-between items-center w-full m-4">
		<div class="flex gap-2">
			<p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Name :</p>
			<p class="text-lg font-semibold text-gray-700 dark:text-gray-200">{task.name}</p>
			<p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Due Date :</p>

			<p class="text-lg font-semibold text-gray-700 dark:text-gray-200">
				<Time timestamp={task.dueDate || new Date()} relative />
			</p>

			{#each fields as field}
				<p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">{field[0]}</p>
				<p class="text-lg font-semibold text-gray-700 dark:text-gray-200">{field[1]}</p>
			{/each}
		</div>
		<form action="/task?/deleteTask" method="POST" use:enhance>
			<input value={task.name} name="name" hidden />
			<button
				class="px-2 py-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red"
			>
				Remove
			</button>
		</form>
	</div>
	<NewField {task} />
</div>
