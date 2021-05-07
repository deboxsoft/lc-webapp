<script>
  import Loader from "__@comps/loader/Loader.svelte";
  import CellRp from "__@comps/CellRp.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAccountContext } from "__@modules/accounting";

  const { loading } = getApplicationContext();
  const { getAccountsTree } = getAccountContext();

  let accounts;
  let isBalanceFixed = false;
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
  <table class="table text-nowrap">
    <thead>
      <tr>
        <th colspan="2">Akun Perkiraan</th>
        <th colspan="2" class="text-center">Saldo</th>
      </tr>
    </thead>
    <tbody>
      {#each $accounts as account}
        <tr>
          <td colspan="2" class="d-xl-table-cell">{account.name}</td>
          <td />
          <td class="text-right">
            <CellRp value={isBalanceFixed ? account.balanceFixed : account.balance} />
          </td>
        </tr>
        {#if account.children}
          {#each account.children as child}
            <tr class="child">
              <td style="width: 10px"></td>
              <td>{child.name}</td>
              <td class="text-right">
                <CellRp value={isBalanceFixed ? child.balanceFixed : child.balance} />
              </td>
              <td />
            </tr>
          {/each}
        {/if}
      {/each}
    </tbody>
  </table>
{/if}
