<script lang="ts">
	import { enhance } from '$app/forms';
	import { sendUsage } from '$src/lib/service/usage';
	import { EventType, Field } from '$src/lib/stubs/task/v1beta/message';
	import modal from '$src/stores/modal';
	import { relativeDate } from '$src/stores/task';
	import Time from 'svelte-time';
	import type { ITask } from '../../helper/taskDto';
	import NewField from './NewField.svelte';
	import RemoveField from './RemoveField.svelte';

	export let task: ITask;

	const handleNewField = () => {
		sendUsage(EventType.UPDATE, task.name);
		modal.open(NewField as any, { task });
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="card w-full h-[calc(100vh-8rem)] lg:min-h-[50rem] lg:w-96 bg-base-100 shadow-xl mx-2 my-1"
	on:click|capture={() => sendUsage(EventType.CLICK, task.name)}
>
	<div class="card-body justify-between h-full">
		<h2 class="card-title justify-between">
			<span class="text-3xl underline underline-offset-8">
				{task.name}
			</span>
			<div class="badge badge-secondary">
				<Time format="H:mm · D MMM YY" timestamp={task.dueDate} relative={$relativeDate} />
			</div>
		</h2>

		<div class="stats stats-vertical shadow pb-2 text-xl overflow-y-auto h-full">
			{#each task.fields as { name, value } (name)}
				<div class="flex justify-between items-center pr-2">
					<div class="stat">
						<div class="stat-desc">{name}</div>
						<div class="stat-title">{value}</div>
					</div>
					<RemoveField {task} fieldToRemove={name} />
				</div>
			{:else}
				<div class="stat">
					<div class="stat-title">No field</div>
				</div>
			{/each}
			<button class="btn btn-primary w-fit place-self-center text-sm" on:click={handleNewField}
				>New Field</button
			>
		</div>

		<div class="card-actions justify-end">
			<form action="/task?/deleteTask" method="POST" use:enhance>
				<input value={task.name} name="name" hidden />
				<button class="btn btn-warning text-base" on:click={() => sendUsage(EventType.DELETE, task.name)}
					>Remove</button
				>
			</form>
		</div>
	</div>
</div>
