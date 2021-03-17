<script lang="ts">
  import type { Account } from "@deboxsoft/accounting-api";

  import { writable } from "svelte/store";
  import { getAccountContext } from "__@modules/accounting";

  const { accountStore, getAccount } = getAccountContext();
  export let code: string | undefined = undefined;
  export let id: string | undefined = undefined;
  let _store = writable({});
  $: {
    _store.set(getAccount({id, code}));
    console.log($_store);
  }
</script>

{#if $_store}
  <div>{$_store.name}</div>
{/if}
