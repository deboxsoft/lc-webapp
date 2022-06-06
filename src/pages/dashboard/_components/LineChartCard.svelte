<script>
  import ChartContainer from "./charts/ChartContainer.svelte";
  import Svg from "./charts/layouts/Svg.svelte";
  import Html from "./charts/layouts/Html.svelte";
  import Line from "./charts/Line.svelte";
  import Card from "./CardChart.svelte";
  import AxisX from "./charts/AxisX.svelte";
  import Tooltip from "./_balance/Tooltip.svelte";
  import { dateLocaleData } from "@deboxsoft/accounting-api";
  import IconSpinner from "__@comps/loader/IconSpinner.svelte";
  import { stores } from "@deboxsoft/accounting-client";

  const { getMonthlyBalanceReportByKey } = stores.getBalanceReportContext();

  export let balanceKey;
  export let label;
  export let monthlyBalanceReportLoading = true;
  export let balanceDataLoading = true;
  let tooltipEvt,
    value,
    loading = false,
    widthContainerChart,
    width,
    yDomain = [0, 1000000];
  const months = dateLocaleData.monthsShort();
  const data = getMonthlyBalanceReportByKey(balanceKey, true);
  const className = $$props.class || "";
  $: {
    if ($data) {
      for (const datum of $data) {
        yDomain[0] = Math.min(datum.data, yDomain[0]);
        yDomain[1] = Math.max(datum.data, yDomain[1]);
      }
      if ($data.length > 0) {
        value = $data[$data.length - 1].data;
      }
    }
  }
</script>

<Card class={className} {label} {value} {loading}>
  <div class="container-fluid" style="height: 50px">
    {#if monthlyBalanceReportLoading}
      <IconSpinner textClass="text-white" />
    {:else}
      <ChartContainer x="month" y="data" data={$data} {yDomain} xDomain={[1, 12]}>
        <Svg>
          <AxisX labelDisable />
          <Line
            stroke="#fff"
            on:tooltip-over={(e) => {
              tooltipEvt = e;
            }}
            on:tooltip-out={(e) => {
              tooltipEvt = e;
            }}
          />
        </Svg>
        <Html>
          <Tooltip />
        </Html>
      </ChartContainer>
    {/if}
  </div>
</Card>
