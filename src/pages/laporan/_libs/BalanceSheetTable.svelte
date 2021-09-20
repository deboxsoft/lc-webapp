<script>
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import Loader from "__@comps/loader/Loader.svelte";
  import CellNumber from "__@comps/CellNumber.svelte";
  import RowBalance from "./BalanceRow.svelte";
  import RowTotalBalance from "./BalanceTotalRow.svelte";
  import { createFoldStore } from "__@stores/fold";
  import { derived } from "svelte/store";

  const { loading } = getApplicationContext();
  export let key;
  const foldStore = createFoldStore({ key, initial: {} });
  const isExpand = (key) => derived(foldStore, (_) => _[key] || false);
  const toggleExpand = (key) => () => {
    $foldStore = {...$foldStore, ...{[key]: !$foldStore[key]}}
  }
  const { balanceSheetReportPerDate } = stores.getBalanceContext();
  let balanceSheetReport;
  let statementIncomeReport;
  let assetsBalance;
  let liabilitiesBalance;
  let statementIncomeBalance;
  let revenueBalance;
  let expenseBalance;
  export let report;
  let state = "loading";

  $: {
    if (report) {
      $loading = true;
      state = "loading";
      balanceSheetReport = report.balanceSheetReport;
      statementIncomeReport = report.statementIncomeReport;
      assetsBalance = report.assetsBalance;
      statementIncomeBalance = report.statementIncomeBalance;
      liabilitiesBalance = report.liabilitiesBalance;
      $loading = false;
      state = "complete";
    }
  }
</script>

{#if state !== "complete"}
  <Loader />
{:else}
  <table class="table text-nowrap table-hover">
    <thead>
      <tr>
        <th colspan="2">Akun Perkiraan</th>
        <th class="text-center" colspan="3">Saldo</th>
      </tr>
    </thead>
    <tbody>
      <!--    aktiva -->
      {#each balanceSheetReport.assetsCurrent.accounts as account}
        <RowBalance {isExpand} toggle={toggleExpand} {account} />
      {/each}
      <RowTotalBalance label="TOTAL AKTIVA" balance={balanceSheetReport.assetsCurrent.balance} />
      <!--pasiva-->
      {#each balanceSheetReport.liabilitiesCurrent.accounts as account}
        <RowBalance {isExpand} toggle={toggleExpand} {account} />
      {/each}
      <RowTotalBalance label="TOTAL PASIVA" balance={balanceSheetReport.liabilitiesCurrent.balance} />

      <!--      Laba rugi-->
      <tr class="table-active table-border-double">
        <td colspan="2">LABA/RUGI</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td class="text-right balance">
          <CellNumber value={statementIncomeBalance} />
        </td>
      </tr>

      <tr class="table-active table-border-double font-weight-bold">
        <td colspan="2">SELISIH</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td class="text-right balance">
          <CellNumber value={assetsBalance - liabilitiesBalance} />
        </td>
      </tr>
    </tbody>
  </table>
{/if}

<style lang="scss">
  .balance {
    width: 200px;
  }
</style>
