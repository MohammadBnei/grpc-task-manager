<script lang="ts">
	import { enhance } from '$app/forms';
	import modal from '$src/stores/modal';
	import FormError from '../FormError.svelte';
	import Register from './Register.svelte';

	let error = '';
</script>

<form
	method="post"
	action="/auth?/login"
	use:enhance={({ data, form }) => {
		return ({ result }) => {
			if (result.type === 'success') {
				form.reset();
				modal.close();
			}
			error = result.data?.error;
		};
	}}
>
	<FormError {error} />
	<button class="btn btn-xs btn-warning" type="submit">Are you sure ?</button>
</form>
