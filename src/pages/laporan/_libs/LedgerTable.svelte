<script>
  import { getApplicationContext } from "__@modules/app";
  import { createFoldStore } from "__@stores/fold";
  import LedgerRow from "./LedgerRow.svelte";
  import { derived, writable } from "svelte/store";

  /**
   * @type {Writable<AccountBalance[]>}
   */
  export let accountsBalance = writable([]);
  export let key;
  export let linkDisable = false;

  const { loading } = getApplicationContext();
  const foldStore = createFoldStore({ key, initial: {} });
  const isExpand = (key) => derived(foldStore, (_) => _[key] || false);
  const toggleExpand = (key) => () => {
    $foldStore = { ...$foldStore, ...{ [key]: !$foldStore[key] } };
  };
</script>

<table class="table text-nowrap table-hover">
  <thead>
    <tr>
      <th colspan="2">Akun Perkiraan</th>
      <th colspan="2" class="text-center">Saldo</th>
      <!--        <th class="-menu-list" />-->
    </tr>
  </thead>
  <tbody>
    {#each $accountsBalance as accountBalance}
      <LedgerRow {isExpand} toggle={toggleExpand} {accountBalance} {linkDisable} />
    {/each}
  </tbody>
</table>
