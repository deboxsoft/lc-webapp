<script>
  import Loader from "__@comps/loader/Loader.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { stores } from "@deboxsoft/accounting-client";
  import { createFoldStore } from "__@stores/fold";
  import RowAccountBalance from "./RowAccountBalance.svelte";

  const { loading } = getApplicationContext();
  const { getAccountsTree } = stores.getAccountContext();
  const foldStore = createFoldStore({ key: "neraca", initial: {} });
  const isExpand = (key) => derived(foldStore, (_) => _[key] || false);
  const toggleExpand = (key) => () => {
    $foldStore = {...$foldStore, ...{[key]: !$foldStore[key]}}
  }
  let accounts;
  export let isBalanceFixed = false;
  $: {
    accounts = getAccountsTree();
    // calculate balance
    for (const account of $accounts) {
      if (account.children) {
        account.balance = 0;
        account.balanceFixed = 0;
        for (const child of account.children) {
          account.balance += child.balance || 0;
          account.balanceFixed += child.balanceFixed || 0;
        }
      }
    }
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
