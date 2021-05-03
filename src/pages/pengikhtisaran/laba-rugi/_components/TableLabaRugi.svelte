<script>
  import { getBalanceContext } from "__@modules/accounting";

  import Loader from "__@comps/loader/Loader.svelte";
  import RowBalance from "../../_components/RowBalance.svelte";
  import RowTotalBalance from "../../_components/RowTotalBalance.svelte";
  import CellRp from "__@comps/CellRp.svelte";

  const { perDate, balanceReportStore, generateReport } = getBalanceContext();

  let loading = false;
  let statementIncomeReport;
  let statementIncomeBalance;
  let revenueBalance;
  let expenseBalance;
  $: {
    if ($balanceReportStore) {
      statementIncomeReport = $balanceReportStore.statementIncomeReport;
      revenueBalance = statementIncomeReport.revenue.balance + statementIncomeReport.revenueOther.balance;
      expenseBalance = statementIncomeReport.expense.balance + statementIncomeReport.expenseOther.balance;
      statementIncomeBalance = revenueBalance - expenseBalance;
    } else if(!loading) {
      generateReportHandler();
    }
  }

  export async function generateReportHandler() {
    loading = true;
    await generateReport();
    loading = false;
  }
</script>

{#if loading || !$balanceReportStore}
  <Loader />
{:else}
  <table class="table text-nowrap">
    <thead>
    <tr role="row">
      <th>Akun Perkiraan</th>
      <th class="text-center" colspan="3">Saldo</th>
    </tr>
    </thead>
    <tbody>
    <!-- Pendapatan -->
    {#each statementIncomeReport.revenue.accounts as account}
      <RowBalance label={account.name} balance={account.balance} />
    {/each}
    <RowTotalBalance label="PENDAPATAN" balance={statementIncomeReport.revenue.balance} />
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
      <RowBalance label={account.name} balance={account.balance} />
    {/each}
    <RowTotalBalance label="BIAYA" balance={statementIncomeReport.expense.balance} />
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
      <td>Laba/Rugi</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
      <td class="text-right balance">
        <CellRp
          value={revenueBalance - expenseBalance}
        />
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