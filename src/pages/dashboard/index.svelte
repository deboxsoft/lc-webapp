<!--routify:options title="Dashboard"-->
<script>
  import { stores } from "@deboxsoft/accounting-client";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { Chart, registerables } from "chart.js";
  import { getAuthenticationContext } from "__@modules/users";
  import { get } from "svelte/store";
  import LineChartCard from "./_components/LineChartCard.svelte";
  import CashFlowChart from "./_components/CashFlowChart.svelte";
  import RatioChart from "./_components/RatioChart.svelte";
  import { getApplicationContext } from "__@modules/app";
  import AccountChart from "./_components/AccountChart.svelte";

  const auth = getAuthenticationContext();
  const profile = get(auth.authenticationStore);
  const appContext = getApplicationContext();
  const {
    fixedBalanceReport,
    balanceContext,
    ratioBalanceReport,
    currentBalanceSheetReport,
    fetchMonthlyBalanceReport,
    getMonthlyBalanceReportByKey
  } = stores.createBalanceReportContext(appContext);
  const fixedBalanceStore = balanceContext.fixedBalanceStore;

  Chart.register(...registerables);
  currentBalanceSheetReport();
  let dataBalanceLoading = true,
    monthlyBalanceReportLoading = true;

  fetchMonthlyBalanceReport().then((_) => {
    monthlyBalanceReportLoading = false;
  });
  $: {
    if ($fixedBalanceStore) {
      dataBalanceLoading = false;
    }
  }
</script>

<PageLayout>
  <div class="row">
    <div class="col-lg-4">
      <LineChartCard
        balanceKey="revenue"
        class="bg-teal text-white"
        label="PENDAPATAN"
        value={$fixedBalanceReport?.revenue}
        dataLoading={dataBalanceLoading}
        {monthlyBalanceReportLoading}
      />
    </div>
    <div class="col-lg-4">
      <LineChartCard
        balanceKey="expense"
        class="bg-pink text-white"
        label="BIAYA"
        dataLoading={dataBalanceLoading}
        {monthlyBalanceReportLoading}
      />
    </div>
    <div class="col-lg-4">
      <LineChartCard
        balanceKey="profit"
        class="bg-primary text-white"
        label="LABA"
        dataLoading={dataBalanceLoading}
        {monthlyBalanceReportLoading}
      />
    </div>
  </div>
  <div class="row">
    <div class="col-lg-4">
      <LineChartCard
        balanceKey="assets"
        class="bg-purple text-white"
        label="ASET"
        dataLoading={dataBalanceLoading}
        {monthlyBalanceReportLoading}
      />
    </div>
    <div class="col-lg-4">
      <LineChartCard
        balanceKey="cash"
        class="bg-indigo text-white"
        label="SALDO KAS & BANK"
        dataLoading={dataBalanceLoading}
        {monthlyBalanceReportLoading}
      />
    </div>
    <div class="col-lg-4">
      <LineChartCard
        balanceKey="receivable"
        class="bg-warning text-white"
        label="PIUTANG PENJUALAN"
        dataLoading={dataBalanceLoading}
        {monthlyBalanceReportLoading}
      />
    </div>
  </div>
  <div class="row">
    <div class="col">
      <CashFlowChart />
    </div>
  </div>
  <div class="row">
    <div class="col">
      <AccountChart />
    </div>
  </div>
  <div class="row">
    <div class="col">
      <RatioChart ratioBalanceReport={$ratioBalanceReport} {monthlyBalanceReportLoading} />
    </div>
  </div>
</PageLayout>
