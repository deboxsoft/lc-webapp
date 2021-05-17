<script>
  import CellRp from "__@comps/CellRp.svelte";
  import { writable } from "svelte/store";
  import { getAccountContext } from "__@modules/accounting";

  const { accountStore, getAccount } = getAccountContext();
  export let id = undefined;
  export let isBalanceSheet = false;
  export let value = undefined;
  let _store = writable({});
  let _value;
  $: {
    _store = getAccount(id);
    _value = isBalanceSheet ? $_store.balanceSheet : $_store.balance;
    if (typeof value === "function") {
      value = value(_value);
    } else {
      value = _value;
    }
  }
</script>

{#if $_store}
  <CellRp {value} />
{/if}
