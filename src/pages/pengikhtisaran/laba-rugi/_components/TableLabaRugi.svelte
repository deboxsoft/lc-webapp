<script>
  import { getBalanceContext } from "__@modules/accounting";
  import { getApplicationContext } from "__@modules/app";
  import { onMount, tick } from "svelte";

  import Loader from "__@comps/loader/Loader.svelte";
  import CellRp from "__@comps/CellRp.svelte";
  import RowBalance from "../../_components/RowBalance.svelte";
  import RowTotalBalance from "../../_components/RowTotalBalance.svelte";

  const { loading } = getApplicationContext();
  const { balanceSheetReportPerDate } = getBalanceContext();

  export let date;
  let statementIncomeReport;
  let statementIncomeBalance;
  let revenueBalance;
  let expenseBalance;
  let mounted = false;

  onMount(() => {
    tick().then(async () => {
      await generateReportHandler(date);
      mounted = true;
    });
  });

  export async function generateReportHandler(date) {
    $loading = true;
    const result = await balanceSheetReportPerDate(date);
    parsingResult(result);
    $loading = false;
  }

  function parsingResult(result) {
    statementIncomeReport = result.statementIncomeReport;
    revenueBalance = statementIncomeReport.revenue.balance + statementIncomeReport.revenueOther.balance;
    expenseBalance = statementIncomeReport.expense.balance + statementIncomeReport.expenseOther.balance;
    statementIncomeBalance = revenueBalance - expenseBalance;
  }
</script>

{#if $loading || !mounted}
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
        <RowBalance {account} />
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
        <RowBalance {account} />
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
