<script>
  import Loader from "../../../components/loader/Loader.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { createFoldStore } from "__@stores/fold";
  import LedgerRow from "./LedgerRow.svelte";
  import {calculateBalance} from "./helper";
  import { derived, writable } from "svelte/store";

  export let accounts = writable(undefined);
  export let key;

  const { loading } = getApplicationContext();
  const foldStore = createFoldStore({ key, initial: {} });
  const isExpand = (key) => derived(foldStore, (_) => _[key] || false);
  const toggleExpand = (key) => () => {
    $foldStore = {...$foldStore, ...{[key]: !$foldStore[key]}}
  }
  $: {
    if ($accounts) {
      calculateBalance($accounts);
    }
  }
</script>

{#if !$accounts}
  <Loader />
{:else}
  <table class="table text-nowrap table-hover">
    <thead>
      <tr>
        <th colspan="2">Akun Perkiraan</th>
        <th colspan="2" class="text-center">Saldo</th>
<!--        <th class="-menu-list" />-->
      </tr>
    </thead>
    <tbody>
      {#each $accounts as account}
        <LedgerRow {isExpand} toggle={toggleExpand} {account} />
      {/each}
    </tbody>
  </table>
{/if}
