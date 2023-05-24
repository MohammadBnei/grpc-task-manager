# SSR-gRPC.md

## SSR

SSR stands for Server-Side Rendering. It is a process where a server generates an HTML page for a website or application, which is then sent to the user's browser for display. SSR enables search engine crawlers to index the pages of a website, improving its visibility on search results pages. It also enables faster loading times and better performance on slow or unreliable internet connections. SSR is commonly used in modern web development stacks and frameworks, such as ReactJS and VueJS, to provide a better user experience.

The SSR implementation of [Svelte](https://svelte.dev/) is called [SvelteKit](https://kit.svelte.dev/docs/introduction).

## SvelteKit

### Server Side

In SvelteKit, the server part is responsible for handling HTTP requests and generating responses. This includes server-side rendering, API routes, and serving static files. 

Server-side rendering is an important feature of SvelteKit, which means that the server will render the initial HTML for a page before sending it to the client. This improves performance and search engine optimization. 

API routes are routes that handle server-side requests and send responses in the form of JSON or other formats. With SvelteKit, you can define API routes in the `route` folder and use them to interact with a server-side data source or perform other server-side actions.

SvelteKit uses a Node.js server, which is responsible for handling the incoming requests and responses. The server is also responsible for handling dynamic routes and applying middleware to modify requests or responses. SvelteKit provides an easy-to-use API for handling server-side functionality, making it simple and intuitive to build fast and efficient web applications.

This Node.js server will be used in this project to handle the **protocol transcription**: gRPC <-> REST

### Server Hook

Server hooks in SvelteKit are a way to execute code in response to specific server-side events, such as when a user requests a page or data from an API. The server hook is an asynchronous function that receives some context data, including the request and response objects, and returns a value or modifies the context.

When a request is made to a SvelteKit application, the server middleware intercepts the request and executes all the applicable server hooks before rendering the page or returning the response. Each server hook can modify the request or response, perform some data processing, or execute some side effects like accessing a database or sending a notification.

Overall, the server hook in SvelteKit is a powerful and convenient way to add server-side functionality to your app and handle various server events in a modular and composable way.

In the gRPC context, we'll use the server hook to pass the gRPC clients to the request handlers.

## gRPC Task Manager

In this project, we use SvelteKit as the front end. The Svelte part is easy to understand, as it looks like any modern JS framework (React or Vue) but is much more developer-friendly. Take a look at the [tutorial](https://svelte.dev/tutorial/basics) to familiarize yourself with Svelte.

To follow this tutorial, you'll need to [initialize a new SvelteKit app](https://kit.svelte.dev/docs/creating-a-project).
*We'll use TypeScript, ESLint, and Prettier with a skeleton project. But feel free to choose whatever you are most comfortable with*.

### File System

The `src/router` folder is where you will place your pages and API route handler. Please read [the docs](https://kit.svelte.dev/docs/routing) to understand the different types of routing files.

### Initialize gRPC Client

First, we need to generate the client stub for our SvelteKit app. Go to [`proto/buf.gen.yml`](/proto/buf.gen.yaml) and add the following line to the plugin list:

```yml
  - plugin: buf.build/community/timostamm-protobuf-ts
    out: ../<YOUR_SVELTEKIT_FOLDER>/src/lib/stubs
```

Then, run `buf generate` to generate the stubs. We don't need the proto file. You should see a `lib/stubs` folder with TypeScript client generated in the `src` folder.

The following libraries need to be installed:

```sh
npm install -D @grpc/grpc-js @protobuf-ts/runtime-rpc @protobuf-ts/runtime @protobuf-ts/grpc-transport
```

Let's start implementing the connection to the gRPC servers.

Create a `lib/server/grpc.client.ts` file. We need to create a credentials object:

```ts
import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import { ChannelCredentials } from '@grpc/grpc-js';

export const credentials = ChannelCredentials.createInsecure();
```

In production mode, these credentials will be using SSL. For now, we'll use insecure mode.

Next, we will initialize the connection:

```ts
import { env } from '$env/dynamic/private';
import { UserServiceClient } from '$lib/stubs/user/v1alpha/service.client';

const userTransport = new GrpcTransport({
	host: env.USER_API_URL as string,
	channelCredentials: credentials,
});
```

And finally, the instantiated service:

```ts
import { UserServiceClient } from '$lib/stubs/user/v1alpha/service.client';

export const userClient = new UserServiceClient(userTransport);
```

The import path may vary depending on your stub generation configuration. We export the instantiated client service.

And that's it! Our clients are now available in our server-side.

### From gRPC to REST

From now on, things will be easy. We simply need to call our APIs with the instantiated client and return the response in JSON format.

In `src/routes/user/+server.ts`, we will demonstrate how to convert a gRPC answer to a REST response. Write the following:

```ts
import { userClient } from '$lib/server/grpc.client';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const { response } = await userClient.register(data);

	console.log({ user: response.user });

	return new Response(
		JSON.stringify(response.user, (k, v) => (typeof v === 'bigint' ? v.toString() : v))
	);

};
```

Start the user api insecurely :
```sh
# In the user-api folder
insecure=true npm start
```

Add a .env to inject the user-api url :
```sh
# Don't forget to modify with your local url ;)
USER_API_URL=localhost:6000
``` 

Start the sveltekit server :
```sh
npm run dev
```

If all went smoothly, you should be able to test your REST endpoint with the following cURL (or with postman):
```sh
curl -X POST \
  http://localhost:5173/user \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "johndoe@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}'
```

### Real front end

Let's create a user registration page to use our endpoint. We'll use tailwind to style our component, so please [install it](https://tailwindcss.com/docs/guides/sveltekit).

In the same `routes/user` folder, create a `+page.svelte` file. 
In this file, let's write the following template :
```svelte
<div class="flex flex-col justify-center min-h-full px-6 py-12 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<h2 class="mt-10 text-2xl font-bold leading-9 tracking-tight text-center text-gray-900">
			Register
		</h2>
	</div>

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
		<form class="space-y-6">
			<div>
				<label for="email" class="block text-sm font-medium leading-6 text-gray-900"
					>Email address</label
				>
				<div class="mt-2">
					<input
						id="email"
						name="email"
						type="email"
						autocomplete="email"
						required
						class="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					/>
				</div>
			</div>

			<div>
				<label for="firstName" class="block text-sm font-medium leading-6 text-gray-900"
					>First Name</label
				>
				<div class="mt-2">
					<input
						id="firstName"
						name="firstName"
						type="text"
						required
						class="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					/>
				</div>
			</div>

			<div>
				<label for="lastName" class="block text-sm font-medium leading-6 text-gray-900"
					>Last Name</label
				>
				<div class="mt-2">
					<input
						id="lastName"
						name="lastName"
						type="text"
						required
						class="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					/>
				</div>
			</div>

			<div>
				<div class="flex items-center justify-between">
					<label for="password" class="block text-sm font-medium leading-6 text-gray-900"
						>Password</label
					>
				</div>
				<div class="mt-2">
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						class="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					/>
				</div>
			</div>

			<div>
				<button
					type="submit"
					class="flex w-full justify-center rounded-md bg-indigo-600 px-3 p-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>Register</button
				>
			</div>
		</form>
	</div>
</div>
```

Go to http://localhost:5173/user to see the form.

We can now proceed to add the post logic.

At the top of the file, in a script tag, let's implement our handleSubmit function:
```svelte
<script lang="ts">
	async function handleSubmit(event: Event) {
		const data: any = {};
		new FormData(event.target as HTMLFormElement).forEach((value, key) => (data[key] = value));

		const response = await fetch('/user', {
			method: 'post',
			body: JSON.stringify(data)
		});

		if (response.ok) {
			const data = await response.json();
			console.log({ data });
		}
	}
</script>
```

Then, use the event listener to trigger this function :
```svelte
...
<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
		<form class="space-y-6" on:submit|preventDefault={handleSubmit}>
...
```

That's it ! You are now able to use your own gRPC microservice in sveltekit.

PS: The last part, with the fetch and the *post* request handler, is now the preferred way in sveltekit. See [here](https://kit.svelte.dev/docs/form-actions) how the best way to do it.