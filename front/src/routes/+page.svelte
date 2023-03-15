<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { searchTerm, taskStore } from '$stores/task';
	import type { ITask } from '$lib/helper/taskDto';
	import Task from '$lib/component/task/Task.svelte';
	import FuzzySearch from 'fuzzy-search';
	import modal from '$stores/modal';
	import NewTask from '$lib/component/task/NewTask.svelte';
	import { connectToTaskStream } from '$lib/service/task';
	import { connectToUsageStream } from '$lib/service/usage';

	export let data: PageData;

	onMount(() => {
		if (browser) {
			taskStore.set(data.tasks);

			connectToTaskStream();
			connectToUsageStream();
		}
	});

	let tasks: ITask[];
	$: searcher = new FuzzySearch($taskStore, ['name', 'fields.name'], {
		caseSensitive: false
	});
	$: if ($searchTerm) {
		tasks = searcher.search($searchTerm);
	} else {
		tasks = $taskStore;
	}

	const handleCreateTask = () => modal.open(NewTask as any);
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<div class="flex w-full flex-wrap items-center justify-center p-4 overflow-x-auto">
	{#each tasks as task (task.name)}
		<Task {task} />
	{:else}
		<div class="card w-96 h-36 bg-base-100 shadow-x">
			<div class="card-body items-center text-center">
				<h2 class="card-title">No Task.</h2>
				<div class="card-actions justify-end">
					<button class="btn btn-primary" on:click={handleCreateTask}>Create Task</button>
				</div>
			</div>
		</div>
	{/each}
</div>
