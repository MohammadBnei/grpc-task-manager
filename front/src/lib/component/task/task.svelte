<script lang="ts">
	import { enhance } from '$app/forms';
	import { sendUsage } from '$src/lib/service/usage';
	import { EventType } from '$src/lib/stubs/task/v1beta/task';
	import { relativeDate } from '$src/stores/task';
	import Time from 'svelte-time';
	import type { ITask } from '../../helper/taskDto';
	import NewField from './newField.svelte';
	import RemoveField from './removeField.svelte';

	export let task: ITask;

	$: fields = Object.entries(task.fields);

	let showNewField = false;

	$: if (showNewField) {
		sendUsage(EventType.UPDATE, task.name)
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="card w-96 bg-base-100 shadow-xl m-1"
	on:click|capture={() => sendUsage(EventType.CLICK, task.name)}
>
	<div class="card-body">
		<h2 class="card-title">
			{task.name}
			<div class="badge badge-secondary">
				<Time format="H:mm · D MMM YY" timestamp={task.dueDate} relative={$relativeDate} />
			</div>
		</h2>

		<div class="stats stats-vertical shadow h-52">
			{#each fields as field}
				<div class="flex justify-between items-center pr-2">
					<div class="stat">
						<div class="stat-desc">{field[0]}</div>
						<div class="stat-title">{field[1]}</div>
					</div>
					<RemoveField {task} fieldToRemove={field[0]} />
				</div>
			{:else}
				<div class="stat">
					<div class="stat-title">No field</div>
				</div>
			{/each}
		</div>
		<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
		<div
			tabindex="0"
			class="collapse border border-base-300 bg-base-100 rounded-box"
			class:w-32={!showNewField}
		>
			<input type="checkbox" bind:checked={showNewField} />
			<div class="collapse-title pr-2 font-medium">New Field</div>
			<div class="collapse-content">
				<NewField {task} />
			</div>
		</div>
		<div class="card-actions justify-end">
			<form action="/task?/deleteTask" method="POST" use:enhance>
				<input value={task.name} name="name" hidden />
				<button class="btn btn-warning" on:click={() => sendUsage(EventType.DELETE, task.name)}>Remove</button>
			</form>
		</div>
	</div>
</div>
