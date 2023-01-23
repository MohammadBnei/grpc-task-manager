<script lang="ts">
	import type { PageData } from './$types';
	import SveltyPicker from 'svelty-picker';
	import { clickOutside } from '$lib/ioevents/click';
	import { keydownEscape } from '$lib/ioevents/keydown';
	import { applyAction, enhance } from '$app/forms';

	export let data: PageData;

	let isModalOpen = false;

	const openModal = () => {
		isModalOpen = true;
	};

	const closeModal = () => {
		isModalOpen = false;
	};
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<main class="h-full overflow-y-auto">
	<div class="container px-6 mx-auto grid">
		<h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Dashboard</h2>
		<!-- CTA -->
		<a
			class="flex items-center justify-between p-4 mb-8 text-sm font-semibold text-purple-100 bg-purple-600 rounded-lg shadow-md focus:outline-none focus:shadow-outline-purple"
			href="https://github.com/daison12006013/sveltekit-windmill-admin"
		>
			<div class="flex items-center">
				<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
					<path
						d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
					/>
				</svg>
				<span>Star this project on GitHub</span>
			</div>
			<span>View more &RightArrow;</span>
		</a>
		<!-- content here -->
		<!-- Cards -->
		<div class="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
			<div class="m-auto">
				<button
					on:click={openModal}
					class="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
				>
					+
				</button>
			</div>
			{#each data.tasks as task (task.name)}
				<!-- Card -->
				<div class="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
					<div
						class="p-3 mr-4 text-orange-500 bg-orange-100 rounded-full dark:text-orange-100 dark:bg-orange-500"
					>
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
							<path
								d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"
							/>
						</svg>
					</div>
					<div>
						<p class="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">Name :</p>
						<p class="text-lg font-semibold text-gray-700 dark:text-gray-200">{task.name}</p>
						<p class="text-lg font-semibold text-gray-700 dark:text-gray-200">{task.dueDate}</p>
						<form action="/task?/deleteTask" method="POST" use:enhance>
							<input value={task.name} name="name" hidden />
							<button
								class="px-2 py-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-red"
							>
								Remove
							</button>
						</form>
					</div>
				</div>
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
						class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input px-1"
						name="name"
						placeholder="lorem"
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
