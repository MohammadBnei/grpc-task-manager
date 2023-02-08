<script lang="ts">
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { searchTerm, taskStore } from '$src/stores/task';
	import type { ITask } from '$src/lib/helper/taskDto';
	import Task from '$src/lib/component/task/task.svelte';
	import FuzzySearch from 'fuzzy-search';
	import modal from '$src/stores/modal';
	import NewTask from '$src/lib/component/task/newTask.svelte';
	import { connectToTaskStream } from '$src/lib/service/task';
	import { connectToUsageStream } from '$src/lib/service/usage';

	export let data: PageData;

	onMount(() => {
		if (browser) {
			taskStore.set(data.tasks);

			connectToTaskStream();
			connectToUsageStream();
		}
	});

	let tasks: ITask[];
	$: if ($searchTerm) {
		const searcher = new FuzzySearch(tasks, ['name'], {
			caseSensitive: false
		});
		tasks = searcher.search($searchTerm);
	} else {
		tasks = $taskStore;
	}
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<div class="flex w-full flex-col lg:flex-row flex-wrap justify-center">
	{#each tasks as task (task.name)}
		<Task {task} />
	{:else}
		<div class="card w-96 bg-base-100 shadow-x">
			<div class="card-body items-center text-center">
				<h2 class="card-title">No Task.</h2>
				<div class="card-actions justify-end">
					<button class="btn btn-primary" on:click={() => modal.open(NewTask)}>Create Task</button>
				</div>
			</div>
		</div>
	{/each}
</div>
