<script lang="ts">
	import { enhance } from '$app/forms';
	import { showInfoToast } from '$src/lib/service/notification';
	import modal from '$src/stores/modal';
	import FormError from '../FormError.svelte';
	import Login from './Login.svelte';

	let error = '';

	const openLogin = () => modal.open(Login as any);
</script>

<form
	method="post"
	action="/auth?/register"
	use:enhance={({ data, form, cancel }) => {
		if (data.get('password') !== data.get('confirmPassword')) {
			error = "Passwords don't match";
			cancel();
		}
		return ({ result }) => {
			if (result.type === 'success') {
				form.reset();
				openLogin();
				showInfoToast('Registered');
			}
			error = result.data?.error;
		};
	}}
>
	<FormError {error} />
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<div class="form-control">
		<label class="input-group input-group-sm my-2">
			<span class="w-24 p-2">Email</span>
			<input type="email" class="input input-bordered" name="email" required />
		</label>
		<label class="input-group input-group-sm my-2">
			<span class="w-24 p-2">First Name</span>
			<input type="text" class="input input-bordered" name="firstName" required />
		</label>
		<label class="input-group input-group-sm my-2">
			<span class="w-24 p-2">Last Name</span>
			<input type="text" class="input input-bordered" name="lastName" required />
		</label>
		<label class="input-group input-group-sm my-2">
			<span class="w-24 p-2">Password</span>
			<input type="password" class="input input-bordered" name="password" required />
		</label>
		<label class="input-group input-group-sm my-2">
			<span class="w-24 p-2">Confirm Password</span>
			<input type="password" class="input input-bordered" name="confirmPassword" required />
		</label>
	</div>
	<button class="btn btn-primary" type="submit">Register</button>
	<button class="btn btn-xs" on:click={openLogin}>Login</button>
</form>
