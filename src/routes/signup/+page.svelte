<script lang="ts">
	import { applyAction, enhance } from "$app/forms";
	import type { ActionData } from "./$types";
	import { goto } from "$app/navigation";
	export let form: ActionData;
	let loading = false;
</script>

<section class="max-w-sm mx-auto">
	<div class="prose">
		<h1>Register</h1>
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
				type="password"
				name="password"
				placeholder="Password..."
				class="input input-bordered w-full"
				required
			/>
		</p>
		<p>
			<input
				type="password"
				name="password-confirm"
				placeholder="Confirm password..."
				class="input input-bordered w-full"
				required
			/>
		</p>
		<p class="flex items-center gap-6 mt-6">
			<button class="btn btn-primary">Save</button>
		</p>
	</form>
	{#if loading}
		<p>
			Please wait ...
		</p>
	{/if}
</section>
