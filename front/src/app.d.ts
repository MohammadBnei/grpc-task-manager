// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { TaskServiceClient, UsageServiceClient, FieldServiceClient } from '$lib/stubs/Field/v1beta/task.client';

// and what to do when importing types
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			taskClient: TaskServiceClient;
			fieldClient: FieldServiceClient;
			usageClient: UsageServiceClient;
		}

		// interface PageData {}
		// interface Platform {}
	}
}

export {};
