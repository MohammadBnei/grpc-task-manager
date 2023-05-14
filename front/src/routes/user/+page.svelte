<script lang="ts">
	import { enhance } from '$app/forms';
	import FormError from '$src/lib/component/FormError.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: user = data.user;
	let error = '';
</script>

<svelte:head>
	<title>User Update</title>
</svelte:head>

<div class="flex w-full flex-wrap items-center justify-center p-4">
	<form
		action="/user?/update"
		method="post"
		use:enhance={({ data }) => {
			data.set('userId', user.id);

			return ({ result }) => {
				error = result.data?.error;
			};
		}}
	>
		<FormError {error} />
		<div class="form-control">
			<label class="input-group input-group-sm my-2">
				<span class="w-24 p-2">Email</span>
				<input type="email" class="input input-bordered" value={user.email} name="email" disabled />
			</label>
			<label class="input-group input-group-sm my-2">
				<span class="w-24 p-2">First Name</span>
				<input type="text" class="input input-bordered" name="firstName" value={user.firstName} />
			</label>
			<label class="input-group input-group-sm my-2">
				<span class="w-24 p-2">Last Name</span>
				<input type="text" class="input input-bordered" name="lastName" value={user.lastName} />
			</label>
		</div>
		<button class="btn btn-primary" type="submit">Submit</button>
	</form>
</div>
