<script>
  import { stores } from "@deboxsoft/accounting-client";
  import AutoCompleteField from "__@comps/forms/AutoCompleteField.svelte";
  import { createEventDispatcher } from "svelte";

  const accountContext = stores.getAccountContext();
  export let accountStore = accountContext.accountStore;
  export let accountId = undefined;
  export let allowEmpty = false;
  export let name = "accountId";
  export let placeholder = "Pilih Akun"
  export let disabled = false;
  export let selectedAccount = accountContext.getAccount(accountId);
  const dispatch = createEventDispatcher();

  let initialed = false // mencegah loop

  $: {
    if (!$selectedAccount && !allowEmpty && !initialed && $accountStore.length > 0) {
      accountId = $accountStore[0].id;
      initialed = true;
      selectedAccount = accountContext.getAccount(accountId);
    }
  }

  function changeHandler(e: any) {
    accountId = e.detail;
    selectedAccount = accountContext.getAccount(accountId);
    dispatch("change", $selectedAccount);
  }
</script>

<AutoCompleteField
  {...$$restProps}
  {disabled}
  {name}
  {allowEmpty}
  inputClassName="form-control"
  {placeholder}
  items={$accountStore || []}
  pristineValue={accountId}
  on:change={changeHandler}
  labelFunction={(account) => account && `${account.id} - ${account.name}`}
  valueFieldName="id"
  keywordsFunction={(account) => account && `${account.id} ${account.name}`}
/>
