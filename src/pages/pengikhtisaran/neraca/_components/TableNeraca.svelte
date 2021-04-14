<script>
  import { getBalanceContext } from "__@modules/accounting";

  import Loader from "__@comps/loader/Loader.svelte";
  import RowBalance from "../../_components/RowBalance.svelte";
  import CellRp from "__@comps/CellRp.svelte";

  const { perDate, balanceReportStore, generateReport } = getBalanceContext();

  let loading = false;
  let balanceSheetReport;
  let statementIncomeReport;
  let assetsBalance;
  let liabilitiesBalance;
  let statementIncomeBalance;
  let revenueBalance;
  let expenseBalance;
  $: {
    if ($balanceReportStore) {
      balanceSheetReport = $balanceReportStore.balanceSheetReport;
      statementIncomeReport = $balanceReportStore.statementIncomeReport;
      assetsBalance = balanceSheetReport.assetsCurrent.balance + balanceSheetReport.assetsFixed.balance;
      revenueBalance = statementIncomeReport.revenue.balance + statementIncomeReport.revenueOther.balance;
      expenseBalance = statementIncomeReport.expense.balance + statementIncomeReport.expenseOther.balance;
      statementIncomeBalance = revenueBalance - expenseBalance;
      liabilitiesBalance =
        balanceSheetReport.liabilitiesCurrent.balance +
        balanceSheetReport.liabilitiesFixed.balance +
        balanceSheetReport.equities.balance + statementIncomeBalance
      ;
    } else if(!loading) {
      generateReportHandler()
    }
    console.log(balanceSheetReport);
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
      {#each balanceSheetReport.assetsCurrent.accounts as account}
        <RowBalance name={account.name} balance={account.balance} />
      {/each}
      <tr class="table-active table-border-double">
        <td>Aktiva Lancar</td>
        <td>&nbsp;</td>
        <td class="text-right" style="width: 200px">
          <CellRp value={balanceSheetReport.assetsCurrent.balance} />
        </td>
        <td style="width: 200px">&nbsp;</td>
      </tr>
      {#each balanceSheetReport.assetsFixed.accounts as account}
        <RowBalance name={account.name} balance={account.balance} />
      {/each}
      <tr class="table-active table-border-double">
        <td>Aktiva Tetap</td>
        <td>&nbsp;</td>
        <td class="text-right">
          <CellRp value={balanceSheetReport.assetsFixed.balance} />
        </td>
        <td>&nbsp;</td>
      </tr>
      <tr class="table-active table-border-double font-weight-bold">
        <td>Total Aktiva</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td class="text-right">
          <CellRp value={assetsBalance} />
        </td>
      </tr>
      <!--pasiva-->
      {#each balanceSheetReport.liabilitiesCurrent.accounts as account}
        <RowBalance name={account.name} balance={account.balance} />
      {/each}
      <tr class="table-active table-border-double">
        <td>Pasiva Lancar</td>
        <td>&nbsp;</td>
        <td class="text-right">
          <CellRp value={balanceSheetReport.liabilitiesCurrent.balance} />
        </td>
        <td>&nbsp;</td>
      </tr>
      {#each balanceSheetReport.liabilitiesFixed.accounts as account}
        <RowBalance name={account.name} balance={account.balance} />
      {/each}
      <tr class="table-active table-border-double">
        <td>Pasiva Lancar</td>
        <td>&nbsp;</td>
        <td class="text-right">
          <CellRp value={balanceSheetReport.liabilitiesFixed.balance} />
        </td>
        <td>&nbsp;</td>
      </tr>

      <!--      modal-->
      {#each balanceSheetReport.equities.accounts as account}
        <RowBalance name={account.name} balance={account.balance} />
      {/each}
      <tr class="table-active table-border-double">
        <td>Modal</td>
        <td>&nbsp;</td>
        <td class="text-right">
          <CellRp value={balanceSheetReport.equities.balance} />
        </td>
        <td>&nbsp;</td>
      </tr>

      <!--      Laba rugi-->
      <tr class="table-active table-border-double">
        <td>Laba/Rugi</td>
        <td>&nbsp;</td>
        <td class="text-right">
          <CellRp value={statementIncomeBalance} />
        </td>
        <td>&nbsp;</td>
      </tr>

      <tr class="table-active table-border-double font-weight-bold">
        <td>Total Pasiva</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td class="text-right">
          <CellRp
            value={liabilitiesBalance}
          />
        </td>
      </tr>

      <tr class="table-active table-border-double font-weight-bold">
        <td>Selisih</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td class="text-right">
          <CellRp
            value={assetsBalance - liabilitiesBalance}
          />
        </td>
      </tr>
    </tbody>
  </table>
{/if}
