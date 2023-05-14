<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { showInfoToast } from '$src/lib/service/notification';
	import modal from '$src/stores/modal';
	import FormError from '../FormError.svelte';
	import Register from './Register.svelte';

	let error = '';
	const openRegister = () => modal.open(Register as any);
</script>

<div class="flex justify-center items-center">
	<form
		method="post"
		action="/auth?/login"
		use:enhance={({ form }) => {
			return ({ result }) => {
				if (result.type === 'success') {
					form.reset();
					modal.close();
					showInfoToast('Connected');
					invalidate('auth');
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
				<span class="w-24 p-2">Password</span>
				<input type="password" class="input input-bordered" name="password" required />
			</label>
		</div>
		<button class="btn btn-primary" type="submit">Login</button>
		<button class="btn btn-xs" on:click={openRegister}>Register</button>
	</form>
</div>
