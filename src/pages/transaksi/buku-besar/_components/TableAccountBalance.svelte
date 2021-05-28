<script>
  import Loader from "__@comps/loader/Loader.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { stores } from "@deboxsoft/accounting-client";
  import RowAccountBalance from "./RowAccountBalance.svelte";

  const { loading } = getApplicationContext();
  const { getAccountsTree } = stores.getAccountContext();

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
        <RowAccountBalance {isBalanceFixed} {account} />
      {/each}
    </tbody>
  </table>
{/if}
