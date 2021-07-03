<script>
  import { getFormContext } from "__@stores/form";
  import { stores } from "@deboxsoft/accounting-client";
  import { createEventDispatcher } from "svelte";

  const { validateField, fields, fieldsErrors, submitted } = getFormContext() || {};
  const accountContext = stores.getAccountContext();
  export let accountStore = accountContext.accountStore;
  export let name = "accountId";
  export let accountId = $fields && $fields[name] || undefined;
  export let selectedAccount = undefined;
  export let allowEmpty = false;
  const dispatch = createEventDispatcher();

  function createChangeHandler() {
    const _validate = validateField(name);
    return (e) => {
      _validate();
      dispatch("change", e.detail);
    };
  }
</script>

<select
  {...$$restProps}
  class="form-control form-control-uniform"
  bind:value={$fields[name]}
  on:change={createChangeHandler()}
>
  {#if allowEmpty}
    <option />
  {/if}
  {#each $accountStore as account}
    <option value={account.id}>{account.id} - {account.name}</option>
  {/each}
</select>
