<script lang="ts">
  import { writable } from "svelte/store";
  import { stores } from "@deboxsoft/accounting-client";

  const { accountStore, getAccount } = stores.getAccountContext();
  export let id: string | undefined = undefined;
  let _store = writable({});
  $: {
    _store = getAccount(id);
  }
</script>

{#if $_store}
  <div>{$_store.name || "-"}</div>
{/if}
