// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { AuthServiceClient } from './lib/stubs/auth/v1alpha/service';
import type {
	FieldServiceClient,
	TaskServiceClient,
	UsageServiceClient
} from './lib/stubs/task/v1beta/task';
import type { UserServiceClient } from './lib/stubs/user/v1alpha/service';

// and what to do when importing types
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			taskClients: {
				crudClient: TaskServiceClient;
				fieldClient: FieldServiceClient;
				usageClient: UsageServiceClient;
			};
			authClient: AuthServiceClient;
			userClient: UserServiceClient;
		}

		// interface PageData {}
		// interface Platform {}
	}
}

export {};
