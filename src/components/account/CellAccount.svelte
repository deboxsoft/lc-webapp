<script lang="ts">
  import { writable } from "svelte/store";
  import { getAccountContext } from "__@modules/accounting";

  const { accountStore, getAccount } = getAccountContext();
  export let id: string | undefined = undefined;
  let _store = writable({});
  $: {
    _store =getAccount(id);
  }
</script>

{#if $_store}
  <div>{$_store.name || "-"}</div>
{/if}
