<script>
  import CellNumber from "__@comps/CellNumber.svelte";
  import { writable } from "svelte/store";
  import { stores } from "@deboxsoft/accounting-client";

  const { accountStore, getAccount } = stores.getAccountContext();
  export let id = undefined;
  export let isBalanceSheet = false;
  export let value = undefined;
  let _store = writable({});
  let _value;
  $: {
    _store = getAccount(id);
    _value = $_store.balance;
    if (typeof value === "function") {
      value = value(_value);
    } else {
      value = _value;
    }
  }
</script>

{#if $_store}
  <CellNumber {value} {...$$restProps} />
{/if}
