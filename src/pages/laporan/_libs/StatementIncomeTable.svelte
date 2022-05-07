<script>
  import CellNumber from "__@comps/CellNumber.svelte";
  import RowBalance from "./BalanceRow.svelte";
  import RowTotalBalance from "./BalanceTotalRow.svelte";
  import { createFoldStore } from "__@root/stores/fold";
  import { derived } from "svelte/store";

  export let key;
  /**
   * @type{BalanceSheetReport}
   */
  export let balanceSheetReport;
  const statementIncome = balanceSheetReport.statementIncome;
  const accountsBalance = balanceSheetReport.accountsBalance;
  const foldStore = createFoldStore({ key, initial: {} });
  const isExpand = (key) => derived(foldStore, (_) => _[key] || false);
  const toggleExpand = (key) => () => {
    $foldStore = { ...$foldStore, ...{ [key]: !$foldStore[key] } };
  };
</script>

<table class="table text-nowrap">
  <thead>
    <tr role="row">
      <th colspan="2">Akun Perkiraan</th>
      <th class="text-center" colspan="3">Saldo</th>
    </tr>
  </thead>
  <tbody>
    <!-- Pendapatan -->
    {#each statementIncome.revenue.accountsIndex as accountIndex}
      <RowBalance {isExpand} toggle={toggleExpand} account={accountsBalance[accountIndex]} />
    {/each}
    <RowTotalBalance label="TOTAL PENDAPATAN" balance={statementIncome.revenue.balance} />
    {#each statementIncome.expense.accountsIndex as accountIndex}
      <RowBalance {isExpand} toggle={toggleExpand} account={accountsBalance[accountIndex]} />
    {/each}
    <RowTotalBalance label="TOTAL BIAYA" balance={statementIncome.expense.balance} />
    <tr class="table-active table-border-double font-weight-bold">
      <td colspan="2">LABA/RUGI</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
      <td class="text-right balance">
        <CellNumber value={statementIncome.profit} />
      </td>
    </tr>
  </tbody>
</table>

<style lang="scss">
  .balance {
    width: 200px;
  }
</style>
