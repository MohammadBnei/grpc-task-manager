// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { TaskServiceClient } from "$lib/taskService/task/v1alpha/task.client";

// and what to do when importing types
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			client: TaskServiceClient;
		}

		// interface PageData {}
		// interface Platform {}
	}
}

export {};
