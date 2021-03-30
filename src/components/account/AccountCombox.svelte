<script>
  import { getAccountContext } from "../../modules/accounting";
  import { createEventDispatcher } from "svelte";

  const accountContext = getAccountContext();
  export let accountStore = accountContext.accountStore;
  export let name = "accountId";
  export let accountId = undefined;
  export let selectedAccount = undefined;
  export let allowEmpty = false;
  const dispatch = createEventDispatcher();

  function createChangeHandler() {
    return (e) => {
      dispatch("change", accountId);
    };
  }
</script>

<select
  {...$$restProps}
  class="form-control form-control-uniform"
  bind:value={accountId}
  on:change={createChangeHandler()}
>
  {#if allowEmpty}
    <option />
  {/if}
  {#each $accountStore as account}
    <option value={account.id}>{account.id} - {account.name}</option>
  {/each}
</select>
