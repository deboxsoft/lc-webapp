<script>
  import { stores } from "@deboxsoft/accounting-client";
  import AutoCompleteField from "../forms/AutoCompleteField.svelte";
  import { createEventDispatcher } from "svelte";

  const accountContext = stores.getAccountContext();
  export let accountStore = accountContext.accountStore;
  export let accountId = undefined;
  export let allowEmpty = false;
  export let name = "accountId";
  export let placeholder = "Pilih Akun";
  export let disabled = false;
  export let selectedAccount = accountContext.getAccount(accountId);
  export let clearAccountValue = undefined;
  const className = $$props.class || "";
  const dispatch = createEventDispatcher();

  let initialed = false; // mencegah loop

  $: {
    if (!$selectedAccount && !allowEmpty && !initialed && $accountStore.length > 0) {
      accountId = $accountStore[0].id;
      initialed = true;
      selectedAccount = accountContext.getAccount(accountId);
    }
  }

  function changeHandler(e) {
    accountId = e.detail;
    selectedAccount = accountContext.getAccount(accountId);
    dispatch("change", $selectedAccount);
  }
</script>

<AutoCompleteField
  {...$$restProps}
  {className}
  {disabled}
  {name}
  {allowEmpty}
  inputClassName="form-control"
  {placeholder}
  items={$accountStore || []}
  pristineValue={accountId}
  on:change={changeHandler}
  labelFunction={(account) => account && account.name}
  valueFieldName="id"
  keywordsFunction={(account) => account && `${account.id} - ${account.name}`}
  bind:clearValue={clearAccountValue}
>
  <svelte:fragment slot="item" let:item let:label>
    {item.id} - {@html label}
  </svelte:fragment>
</AutoCompleteField>
