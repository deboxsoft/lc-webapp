<script lang="ts">
  import type { Account } from "@deboxsoft/accounting-api";
  import { getAccountContext } from "__@modules/accounting";
  import AutoComplete from "__@comps/AutoComplete.svelte";

  const { accountStore } = getAccountContext();
  export let selectedAccount: Account | undefined = undefined;
</script>

<AutoComplete
  {...$$restProps}
  inputClassName="form-control"
  placeholder="Pilih Akun"
  items={$accountStore || []}
  selectedItem={selectedAccount}
  on:change
  labelFunction={(account) => account && `${account.code}  ${account.name}`}
  valueFieldName="id"
  keywordsFunction={(account) => account && `${account.code} ${account.name}`}
/>
