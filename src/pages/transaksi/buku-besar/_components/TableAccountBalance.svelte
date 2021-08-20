<script>
  import Loader from "../../../../components/loader/Loader.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { stores } from "@deboxsoft/accounting-client";
  import { createFoldStore } from "__@stores/fold";
  import RowAccountBalance from "./RowAccountBalance.svelte";
  import {calculateBalance} from "../_utils";
  import { derived } from "svelte/store";

  const { loading } = getApplicationContext();
  const { getAccountsTree } = stores.getAccountContext();
  const foldStore = createFoldStore({ key: "neraca", initial: {} });
  const isExpand = (key) => derived(foldStore, (_) => _[key] || false);
  const toggleExpand = (key) => () => {
    $foldStore = {...$foldStore, ...{[key]: !$foldStore[key]}}
  }
  export let accounts;
  export let isBalanceFixed = false;
  $: {
    accounts = getAccountsTree();
    // calculate balance
    calculateBalance($accounts);
  }
</script>

{#if $loading}
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
        <RowAccountBalance {isExpand} toggle={toggleExpand} {isBalanceFixed} {account} />
      {/each}
    </tbody>
  </table>
{/if}
