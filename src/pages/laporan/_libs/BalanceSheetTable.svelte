<script>
  import CellNumber from "__@comps/CellNumber.svelte";
  import BalanceRow from "./BalanceRow.svelte";
  import RowTotalBalance from "./BalanceTotalRow.svelte";
  import { createFoldStore } from "__@stores/fold";
  import { derived } from "svelte/store";

  export let key;
  /**
   * @type{BalanceSheetReport}
   */
  export let balanceSheetReport;
  let accountsBalance;
  const foldStore = createFoldStore({ key, initial: {} });
  const isExpand = (key) => derived(foldStore, (_) => _[key] || false);
  const toggleExpand = (key) => () => {
    $foldStore = { ...$foldStore, ...{ [key]: !$foldStore[key] } };
  };

  $: {
    accountsBalance = balanceSheetReport.accountsBalance;
  }
</script>

<table class="table text-nowrap table-hover">
  <thead>
    <tr>
      <th colspan="2">Akun Perkiraan</th>
      <th class="text-center" colspan="3">Saldo</th>
    </tr>
  </thead>
  {#if accountsBalance?.length > 0}
    <tbody>
      <!--    aktiva -->
      {#each balanceSheetReport.assets.accountsIndex as accountIndex}
        <BalanceRow
          {isExpand}
          toggle={toggleExpand}
          account={balanceSheetReport.accountsBalance[accountIndex]}
          on:select
        />
      {/each}
      <RowTotalBalance label="TOTAL AKTIVA" balance={balanceSheetReport.assets.balance} />
      <!--pasiva-->
      {#each balanceSheetReport.payable.accountsIndex as accountIndex}
        <BalanceRow
          {isExpand}
          toggle={toggleExpand}
          account={balanceSheetReport.accountsBalance[accountIndex]}
          on:select
        />
      {/each}
      {#each balanceSheetReport.equities.accountsIndex as accountIndex}
        <BalanceRow
          {isExpand}
          toggle={toggleExpand}
          account={balanceSheetReport.accountsBalance[accountIndex]}
          on:select
        />
      {/each}
      <RowTotalBalance label="TOTAL PASIVA" balance={balanceSheetReport.liabilities} />

      <tr class="table-active table-border-double font-weight-bold">
        <td colspan="2">SELISIH</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td class="text-right balance">
          <CellNumber value={balanceSheetReport.assets.balance - balanceSheetReport.liabilities} />
        </td>
      </tr>
    </tbody>
  {/if}
</table>

<style lang="scss">
  .balance {
    width: 200px;
  }
</style>
