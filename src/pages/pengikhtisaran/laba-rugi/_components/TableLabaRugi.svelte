<script>
  import { getBalanceContext } from "__@modules/accounting";

  import Loader from "__@comps/loader/Loader.svelte";
  import RowBalance from "../../_components/RowBalance.svelte";
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
      <th>Akun</th>
      <th class="text-center" colspan="3">Saldo</th>
    </tr>
    </thead>
    <tbody>
    <!--    aktiva -->
    {#each statementIncomeReport.revenue.accounts as account}
      <RowBalance name={account.name} balance={account.balance} />
    {/each}
    <tr class="table-active table-border-double">
      <td>Pendapatan</td>
      <td style="width: 200px">&nbsp;</td>
      <td class="text-right" style="width: 200px">
        <CellRp value={statementIncomeReport.revenue.balance} />
      </td>
      <td style="width: 200px">&nbsp;</td>
    </tr>
    {#each statementIncomeReport.revenueOther.accounts as account}
      <RowBalance name={account.name} balance={account.balance} />
    {/each}
    <tr class="table-active table-border-double">
      <td>Pendapatan Lain-lain</td>
      <td>&nbsp;</td>
      <td class="text-right">
        <CellRp value={statementIncomeReport.revenueOther.balance} />
      </td>
      <td>&nbsp;</td>
    </tr>
    <tr class="table-active table-border-double font-weight-bold">
      <td>Total Pendapatan</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
      <td class="text-right">
        <CellRp value={revenueBalance} />
      </td>
    </tr>
    <!--pasiva-->
    {#each statementIncomeReport.expense.accounts as account}
      <RowBalance name={account.name} balance={account.balance} />
    {/each}
    <tr class="table-active table-border-double">
      <td>Beban</td>
      <td>&nbsp;</td>
      <td class="text-right">
        <CellRp value={statementIncomeReport.expense.balance} />
      </td>
      <td>&nbsp;</td>
    </tr>
    {#each statementIncomeReport.expenseOther.accounts as account}
      <RowBalance name={account.name} balance={account.balance} />
    {/each}
    <tr class="table-active table-border-double">
      <td>Beban Lain-lain</td>
      <td>&nbsp;</td>
      <td class="text-right">
        <CellRp value={statementIncomeReport.expenseOther.balance} />
      </td>
      <td>&nbsp;</td>
    </tr>

    <tr class="table-active table-border-double font-weight-bold">
      <td>Laba/Rugi</td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
      <td class="text-right">
        <CellRp
          value={revenueBalance - expenseBalance}
        />
      </td>
    </tr>
    </tbody>
  </table>
{/if}
