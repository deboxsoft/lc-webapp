<script lang="ts">
  import type { Account } from "@deboxsoft/accounting-api";
  import type { Readable } from "svelte/store";
  import { getAccountContext } from "__@modules/accounting";

  const { getAccount } = getAccountContext();
  export let code: string | undefined = undefined;
  export let id: string | undefined = undefined;
  export let account: Account | undefined = id ? getAccount({ id }) : getAccount({ code });
</script>

{#if account}
  <div>{account.name}</div>
{/if}
