<script lang="ts">
  import type { Account } from "@deboxsoft/accounting-api";
  import { getAccountContext } from "__@modules/accounting";
  import AutoComplete from "__@comps/forms/AutoCompleteField.svelte";
  import { createEventDispatcher } from "svelte";

  const { accountStore } = getAccountContext();
  export let accountId: string | undefined = undefined;
  export let name: string = "accountId";
  export let code: string | undefined = undefined;
  export let selectedAccount: Account | undefined = undefined;
  export let validate: any = undefined;
  const dispatch = createEventDispatcher();

  let account;
  $: {
    if (selectedAccount) {
      account = selectedAccount;
    } else {
      if (accountId) {
        const i = $accountStore.findIndex((_) => _.id === accountId);
        account = $accountStore[i];
      } else if (code) {
        const i = $accountStore.findIndex((_) => _.code === code);
        account = $accountStore[i];
        accountId = $accountStore[i];
      }
    }
  }

  function changeHandler(e) {
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
  labelFunction={(account) => account && `${account.code}  ${account.name}`}
  valueFieldName="id"
  keywordsFunction={(account) => account && `${account.code} ${account.name}`} />
