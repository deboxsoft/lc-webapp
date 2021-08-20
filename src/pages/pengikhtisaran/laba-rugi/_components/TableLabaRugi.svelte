<script>
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import Loader from "../../../../components/loader/Loader.svelte";
  import CellRp from "../../../../components/CellRp.svelte";
  import RowBalance from "../../_components/RowBalance.svelte";
  import RowTotalBalance from "../../_components/RowTotalBalance.svelte";
  import { createFoldStore } from "__@root/stores/fold";
  import { derived } from "svelte/store";

  const { loading } = getApplicationContext();
  export let key = "laba-rugi";
  const foldStore = createFoldStore({ key, initial: {} });
  const isExpand = (key) => derived(foldStore, (_) => _[key] || false);
  const toggleExpand = (key) => () => {
    $foldStore = {...$foldStore, ...{[key]: !$foldStore[key]}}
  }
  const { balanceSheetReportPerDate } = stores.getBalanceContext();
  let statementIncomeReport;
  let statementIncomeBalance;
  let revenueBalance;
  let expenseBalance;
  export let report;

  $: {
    if (report) {
      statementIncomeReport = report.statementIncomeReport;
      revenueBalance = report.revenueBalance;
      expenseBalance = report.expenseBalance;
      statementIncomeBalance = report.statementIncomeBalance;
    }
  }


</script>

{#if !report}
  <Loader />
{:else}
  <table class="table text-nowrap">
    <thead>
      <tr role="row">
        <th colspan="2">Akun Perkiraan</th>
        <th class="text-center" colspan="3">Saldo</th>
      </tr>
    </thead>
    <tbody>
      <!-- Pendapatan -->
      {#each statementIncomeReport.revenue.accounts as account}
        <RowBalance {isExpand} toggle={toggleExpand} {account} />
      {/each}
      <RowTotalBalance label="TOTAL PENDAPATAN" balance={statementIncomeReport.revenue.balance} />
      <!--{#each statementIncomeReport.revenueOther.accounts as account}-->
      <!--  <RowBalance label={account.name} balance={account.balance} />-->
      <!--{/each}-->
      <!--    <RowTotalBalance label="Pendapatan Lain-lain" balance={statementIncomeReport.revenueOther.balance} />-->
      <!--    <tr class="table-active table-border-double font-weight-bold">-->
      <!--      <td>Total Pendapatan</td>-->
      <!--      <td>&nbsp;</td>-->
      <!--      <td>&nbsp;</td>-->
      <!--      <td class="text-right balance">-->
      <!--        <CellRp value={revenueBalance} />-->
      <!--      </td>-->
      <!--    </tr>-->
      <!--Biaya-->
      {#each statementIncomeReport.expense.accounts as account}
        <RowBalance {isExpand} toggle={toggleExpand} {account} />
      {/each}
      <RowTotalBalance label="TOTAL BIAYA" balance={statementIncomeReport.expense.balance} />
      <!--{#each statementIncomeReport.expenseOther.accounts as account}-->
      <!--  <RowBalance label={account.name} balance={account.balance} />-->
      <!--{/each}-->
      <!--<RowTotalBalance label="Beban Lain-lain" balance={statementIncomeReport.expenseOther.balance} />-->

      <!--    <tr class="table-active table-border-double">-->
      <!--      <td>Total Beban</td>-->
      <!--      <td>&nbsp;</td>-->
      <!--      <td>&nbsp;</td>-->
      <!--      <td class="text-right balance">-->
      <!--        <CellRp value={expenseBalance} />-->
      <!--      </td>-->
      <!--    </tr>-->

      <tr class="table-active table-border-double font-weight-bold">
        <td colspan="2">LABA/RUGI</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td class="text-right balance">
          <CellRp value={revenueBalance - expenseBalance} />
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
