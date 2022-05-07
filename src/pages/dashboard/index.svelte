<!--routify:options title="Dashboard"-->
<script>
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { Chart, registerables } from "chart.js";
  import { getAuthenticationContext } from "__@modules/users";
  import { get } from "svelte/store";
  import LineChartCard from "./_components/LineChartCard.svelte";
  import CashFlowChart from "./_components/CashFlowChart.svelte";
  import RatioChart from "./_components/RatioChart.svelte";

  const auth = getAuthenticationContext();
  const profile = get(auth.authenticationStore);

  Chart.register(...registerables);
</script>

<PageLayout>
  <div class="row">
    <div class="col-lg-4">
      <LineChartCard class="bg-primary text-white" label="LABA" value="500000" />
    </div>
    <div class="col-lg-4">
      <LineChartCard class="bg-teal text-white" label="PENDAPATAN" value="50000" />
    </div>
    <div class="col-lg-4">
      <LineChartCard class="bg-pink text-white" label="BIAYA" value="500000" />
    </div>
  </div>
  <div class="row">
    <div class="col-lg-6">
      <LineChartCard class="bg-indigo text-white" label="SALDO KAS & BANK" value="500000" />
    </div>
    <div class="col-lg-6">
      <LineChartCard class="bg-warning text-white" label="PIUTANG PENJUALAN" value="500000" />
    </div>
  </div>
  <div class="row">
    <div class="col">
      <CashFlowChart />
    </div>
  </div>
  <div class="row">
    <div class="col">
      <RatioChart />
    </div>
  </div>
</PageLayout>
