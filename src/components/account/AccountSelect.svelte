<script lang="ts">
  import type { Account } from "@deboxsoft/accounting-api";
  import { getAccountContext } from "__@modules/accounting";
  import AutoComplete from "__@comps/forms/AutoCompleteField.svelte";
  import { createEventDispatcher } from "svelte";

  const accountContext = getAccountContext();
  export let accountStore = accountContext.accountStore;
  export let accountId: string | undefined = undefined;
  export let name: string = "accountId";
  export let selectedAccount: Account | undefined = undefined;
  const dispatch = createEventDispatcher();

  $: {
    if (selectedAccount) {
      accountId = selectedAccount.id;
    } else {
      if (accountId) {
        const i = $accountStore.findIndex((_) => _.id === accountId);
        selectedAccount = $accountStore[i];
      }
    }
  }

  function changeHandler(e: any) {
    accountId = e.detail;
    dispatch("change", e.detail);
  }
</script>

<AutoComplete
  {...$$restProps}
  {name}
  inputClassName="form-control"
  placeholder="Pilih Akun"
  items={$accountStore || []}
  pristineValue={accountId}
  on:change={changeHandler}
  labelFunction={(account) => account && `${account.id} || ${account.name}`}
  valueFieldName="id"
  keywordsFunction={(account) => account && `${account.id} ${account.name}`} />
