<script>
  import { writable } from "svelte/store";
  import { stores } from "@deboxsoft/accounting-client";

  const { accountStore, getAccount } = stores.getAccountContext();
  export let id = undefined;
  let _store = writable({});
  $: {
    if (id) {
      _store = getAccount(id);
    }
  }
</script>

{#if $_store}
  <div {...$$restProps}>{$_store.name || "-"}</div>
{/if}
