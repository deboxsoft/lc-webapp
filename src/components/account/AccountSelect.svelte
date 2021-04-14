<script lang="ts">
  import { getAccountContext } from "__@modules/accounting";
  import AutoCompleteField from "__@comps/forms/AutoCompleteField.svelte";
  import { createEventDispatcher } from "svelte";

  const accountContext = getAccountContext();
  export let accountStore = accountContext.accountStore;
  export let accountId: string | undefined = undefined;
  export let allowEmpty: boolean = false;
  export let name: string = "accountId";
  export let disabled = false;
  export let selectedAccount = accountContext.getAccount(accountId);
  const dispatch = createEventDispatcher();

  $: {
    if (!$selectedAccount && !allowEmpty && $accountStore.length > 0) {
      accountId = $accountStore[0].id;
      selectedAccount = accountContext.getAccount(accountId);
    }
  }

  function changeHandler(e: any) {
    const _accountId = e.detail;
    selectedAccount = accountContext.getAccount(_accountId);
    dispatch("change", $selectedAccount);
  }
</script>

<AutoCompleteField
  {...$$restProps}
  {disabled}
  {name}
  inputClassName="form-control"
  placeholder="Pilih Akun"
  items={$accountStore || []}
  pristineValue={accountId}
  on:change={changeHandler}
  labelFunction={(account) => account && `${account.id} - ${account.name}`}
  valueFieldName="id"
  keywordsFunction={(account) => account && `${account.id} ${account.name}`}
/>
