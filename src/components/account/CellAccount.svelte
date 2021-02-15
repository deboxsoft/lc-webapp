<script lang="ts">
  import type { Account } from "@deboxsoft/accounting-api";
  import { getAccountContext } from "__@modules/accounting";

  const { getAccount, getAccountByCode } = getAccountContext();
  export let code: string | undefined = undefined;
  export let id: string | undefined = undefined;
  export let account: Account | undefined = id ? getAccount(id) : getAccountByCode(code);
</script>

{#if account}
  <div>{account.name}</div>
{/if}
