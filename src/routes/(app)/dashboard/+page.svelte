<script>
// @ts-nocheck
  import { applyAction, enhance } from '$app/forms';

	let { data, form } = $props();
  console.log('data', data) ;
  let loading = $state(false);
  let requestApplication = $state({});

  let isPolling = $state(false);
  let isFailed = $state(false);
  let isCompleted =$state(false);
  let isConfirmed = $state(false);

/**
 * fetch application request
 * @param interval
 */
  async function fetchStatus(interval = 300) {
    try {
      
      const response = await fetch('/api/request?url='+requestApplication?.url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      data = await response.json();

      if (data.code === 404) {
        isPolling=false;
        isFailed=true;
      }

      if (data.data.status === 'COMPLETED') {
        isPolling=false;
        applyConfirm(data.data);
     
      }
    } catch (err) {
      console.error("Error fetching data:", err);
     
    } finally {
      
      if (isPolling) {
        setTimeout(() => fetchStatus(interval), interval);
      }
    }
  }

  /**
   * confirm request application
   * @param model
   */
  // @ts-ignore
  async function applyConfirm(model) {
    try {
     
      const response = await fetch('/api/request', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ confirm_url: model.confirm_url }),
      });
      const result  = await response.json();
      if (result.code === 200) {
        isConfirmed = true;
      }

    } catch( error) {
      console.error("Error fetching data:", error);
    }
  }

 

</script>
{#if form?.error}
  <p style="color: red;">{form.error}</p>
{/if}



<form method="POST" action="?/createRequestApplication" use:enhance={() => {
  loading = true;
  return async ({ result }) => {
    await applyAction(result);
    loading = false;
     const {requestModel}= result?.data;
     requestApplication = requestModel;
     console.log('requestModel', requestModel);
     isPolling=true;
     await fetchStatus();
  }}
}>
<div>
  <label>
    Email:
    <input
      name="email"
      value={form?.email ?? ""}
      autocomplete="off"
      required
    />
  </label>
</div>
<div>
  <label>
    First Name:
    <input
      name="first_name"
      value={form?.first_name ?? ""}
      autocomplete="off"
      required
    />
  </label>
</div>
<div>
  <label>
    Last Name:
    <input
      name="last_name"
      value={form?.first_name ?? ""}
      autocomplete="off"
      required
    />
  </label>
</div>
  <p class="flex items-center gap-6 mt-6">
    <button class="btn btn-primary">Save</button>
  </p>
  {#if loading}
		<p>
			Please wait ...
		</p>
	{/if}
 
  {#if isPolling}
		<p>
			request pending ....
		</p>
	{/if}

  {#if isCompleted}
		<p>
			request completed
		</p>
	{/if}
  {#if isConfirmed}
		<p>
			request confirmed
		</p>
	{/if}
</form>


<a href="/logout" class="link">Se deconneter</a>