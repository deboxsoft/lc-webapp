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
  let balanceSheetReport;
  let statementIncomeReport;
  let assetsBalance;
  let liabilitiesBalance;
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
    balanceSheetReport = result.balanceSheetReport;
    statementIncomeReport = result.statementIncomeReport;
    assetsBalance = balanceSheetReport.assetsCurrent.balance + balanceSheetReport.assetsFixed.balance;
    revenueBalance = statementIncomeReport.revenue.balance + statementIncomeReport.revenueOther.balance;
    expenseBalance = statementIncomeReport.expense.balance + statementIncomeReport.expenseOther.balance;
    statementIncomeBalance = revenueBalance - expenseBalance;
    liabilitiesBalance =
      balanceSheetReport.liabilitiesCurrent.balance +
      balanceSheetReport.liabilitiesFixed.balance +
      balanceSheetReport.equities.balance +
      statementIncomeBalance;
  }
</script>

{#if $loading || !mounted}
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
        <RowBalance {account} />
      {/each}
      <RowTotalBalance label="TOTAL AKTIVA" balance={balanceSheetReport.assetsCurrent.balance} />
      <!--{#each balanceSheetReport.assetsFixed.accounts as account}-->
      <!--  <RowBalance {account} />-->
      <!--{/each}-->
      <!--<RowTotalBalance label="Aktiva Tetap" balance={balanceSheetReport.assetsFixed.balance} />-->
      <!--      <tr class="table-active table-border-double font-weight-bold">-->
      <!--        <td>Total Aktiva</td>-->
      <!--        <td>&nbsp;</td>-->
      <!--        <td>&nbsp;</td>-->
      <!--        <td class="text-right balance">-->
      <!--          <CellRp value={assetsBalance} />-->
      <!--        </td>-->
      <!--      </tr>-->
      <!--pasiva-->
      {#each balanceSheetReport.liabilitiesCurrent.accounts as account}
        <RowBalance {account} />
      {/each}
      <RowTotalBalance label="TOTAL PASIVA" balance={balanceSheetReport.liabilitiesCurrent.balance} />
      <!--{#each balanceSheetReport.liabilitiesFixed.accounts as account}-->
      <!--  <RowBalance {account} />-->
      <!--{/each}-->
      <!--<RowTotalBalance label="Pasiva Tetap" balance={balanceSheetReport.liabilitiesFixed.balance} />-->

      <!--      modal-->
      <!--{#each balanceSheetReport.equities.accounts as account}-->
      <!--  <RowBalance {account} />-->
      <!--{/each}-->
      <!--      <tr class="table-active table-border-double">-->
      <!--        <td>Modal</td>-->
      <!--        <td>&nbsp;</td>-->
      <!--        <td class="text-right balance">-->
      <!--          <CellRp value={balanceSheetReport.equities.balance} />-->
      <!--        </td>-->
      <!--        <td>&nbsp;</td>-->
      <!--      </tr>-->

      <!--      Laba rugi-->
      <tr class="table-active table-border-double">
        <td colspan="2">LABA/RUGI</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td class="text-right balance">
          <CellRp value={statementIncomeBalance} />
        </td>
      </tr>

      <!--      <tr class="table-active table-border-double font-weight-bold">-->
      <!--        <td>Total Pasiva</td>-->
      <!--        <td>&nbsp;</td>-->
      <!--        <td>&nbsp;</td>-->
      <!--        <td class="text-right balance">-->
      <!--          <CellRp-->
      <!--            value={liabilitiesBalance}-->
      <!--          />-->
      <!--        </td>-->
      <!--      </tr>-->

      <tr class="table-active table-border-double font-weight-bold">
        <td colspan="2">SELISIH</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td class="text-right balance">
          <CellRp value={assetsBalance - liabilitiesBalance} />
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
