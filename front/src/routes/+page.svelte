<script lang="ts">
	import type { PageData } from './$types';
	import SveltyPicker from 'svelty-picker';
	import { clickOutside } from '$lib/ioevents/click';
	import { keydownEscape } from '$lib/ioevents/keydown';
	import { applyAction, enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { taskStore } from '$src/stores/task';
	import TaskItem from '$src/lib/component/task/taskItem.svelte';
	import { connectToTaskStream } from '$src/lib/helper/taskDto';

	export let data: PageData;

	let isModalOpen = false;

	const openModal = () => {
		isModalOpen = true;
	};

	const closeModal = () => {
		isModalOpen = false;
	};

	onMount(() => {
		if (browser) {
			taskStore.set(data.tasks);

			connectToTaskStream()
		}
	});
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<main class="h-full overflow-y-auto">
	<div class="container px-6 mx-auto grid">
		<h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Dashboard</h2>
		<!-- content here -->
		<!-- Cards -->
		<div class="flex flex-col gap-6 mb-8">
			<div class="m-auto">
				<button
					on:click={openModal}
					class="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
				>
					+
				</button>
			</div>
			{#each $taskStore as task (task.name)}
				<TaskItem {task} />
			{/each}
		</div>
	</div>
</main>

<div
	class:hidden={!isModalOpen}
	class="fixed inset-0 z-30 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center"
>
	<!-- Modal -->
	<div
		class:hidden={!isModalOpen}
		use:clickOutside
		use:keydownEscape
		on:keydown-escape={closeModal}
		class="w-full px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-xl"
		role="dialog"
		id="modal"
	>
		<!-- Remove header if you don't want a close icon. Use modal body to place modal tile. -->
		<header class="flex justify-end">
			<button
				class="inline-flex items-center justify-center w-6 h-6 text-gray-400 transition-colors duration-150 rounded dark:hover:text-gray-200 hover: hover:text-gray-700"
				aria-label="close"
				on:click={closeModal}
			>
				<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" role="img" aria-hidden="true">
					<path
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clip-rule="evenodd"
						fill-rule="evenodd"
					/>
				</svg>
			</button>
		</header>
		<!-- Modal body -->
		<div class="mt-4 mb-6">
			<!-- Modal title -->
			<p class="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">New Task</p>
			<!-- Modal description -->
			<form
				class="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800"
				action="/task?/newTask"
				method="POST"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							closeModal();
						}
						await applyAction(result);
					};
				}}
			>
				<label class="block text-sm my-2">
					<span class="text-gray-700 dark:text-gray-400">Name</span>
					<input
						class="mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input px-1"
						name="name"
					/>
				</label>
				<label class="block text-sm my-2">
					<span class="text-gray-700 dark:text-gray-400">Due Date</span>
					<SveltyPicker
						inputClasses="text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input px-1"
						format="yyyy-mm-dd hh:ii"
						name="dueDate"
						startDate={new Date().toDateString()}
					/>
				</label>
				<button
					type="submit"
					class="w-full px-5 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg sm:w-auto sm:px-4 sm:py-2 active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
				>
					Accept
				</button>
			</form>
		</div>
		<footer
			class="flex flex-col items-center justify-end px-6 py-3 -mx-6 -mb-4 space-y-4 sm:space-y-0 sm:space-x-6 sm:flex-row bg-gray-50 dark:bg-gray-800"
		>
			<button
				on:click={closeModal}
				class="w-full px-5 py-3 text-sm font-medium leading-5 text-gray-700 transition-colors duration-150 border border-gray-300 rounded-lg dark:text-gray-400 sm:px-4 sm:py-2 sm:w-auto active:bg-transparent hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:outline-none focus:shadow-outline-gray"
			>
				Cancel
			</button>
		</footer>
	</div>
</div>
