<script lang="ts">
	import { applyAction, enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import type { ActionData } from "./$types";
	export let form: ActionData;
	let loading = false;
	
</script>


<section class="max-w-sm mx-auto">
	<div class="prose">
		<h1 class="">Login page</h1>
		
	</div>
	<form
		class="flex flex-col gap-6 my-6"
		method="POST"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				await applyAction(result);
				loading = false;

				if (result.type === "success") {
					const user = result.data?.user;
					await goto("/dashboard");
				}
			}}
		}
	>
		{#if form?.error}
			<div class="alert alert-error">
				<div>
					
					{form.error}
				</div>
			</div>
		{/if}
		<p>
			<input
				autocomplete="email"
				autocorrect="off"
				type="email"
				name="email"
				placeholder="Email..."
				class="input input-bordered w-full"
				required
				value={form?.email ?? ""}
			/>
		</p>
		<p>
			<input
				autocomplete="current-password"
				type="password"
				name="password"
				placeholder="Password..."
				class="input input-bordered w-full"
				required
			/>
		</p>
		<p class="flex items-center gap-6 mt-6">
			<button class="btn btn-primary">Login</button>
			or
			<a href="/signup" class="link">Register</a>
		</p>
	</form>

	{#if loading}
		<p>
			Please wait ...
		</p>
	{/if}
</section>
