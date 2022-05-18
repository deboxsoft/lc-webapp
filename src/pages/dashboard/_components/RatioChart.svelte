<script>
  import { seriesRatioNames } from "@deboxsoft/accounting-api";
  import { stores } from "@deboxsoft/accounting-client";
  import ChartContainer from "./charts/ChartContainer.svelte";
  import Svg from "./charts/layouts/Svg.svelte";
  import Html from "./charts/layouts/Html.svelte";
  import AxisY from "./charts/AxisY.svelte";
  import AxisX from "./charts/AxisX.svelte";
  import Column from "./_ratio-components/Column.svelte";
  import Tooltip from "./_ratio-components/Tooltip.svelte";

  import { format } from "d3-format";
  import { scaleBand } from "d3-scale";
  import { getApplicationContext } from "__@modules/app";
  import IconSpinner from "__@comps/loader/IconSpinner.svelte";

  const appContext = getApplicationContext();
  const { fixedMonthlyBalanceReportStore, currentMonthlyBalanceReportStore } =
    stores.createBalanceReportContext(appContext);
  const className = $$props.class || "";

  /**
   * store Readable
   * @type {import("@deboxsoft/accounting-api").RatioBalanceReport}
   */
  export let ratioBalanceReport;
  export let dataLoading = true;
  /**
   * @type {HTMLElement}
   */
  let containerEl, tooltipEvt;
  let loading = false;

  const formatTickY = (d) => format(".0%")(d);
  let minValue = 0,
    maxValue = 1;
  const data = [];
  const xDomain = [];

  $: {
    if (ratioBalanceReport) {
      processingData();
      dataLoading = false;
    }
  }

  function processingData() {
    for (const seriesRatioName of seriesRatioNames) {
      const key = seriesRatioName[0];
      let value = ratioBalanceReport[key];
      if (isFinite(value)) {
        let _tmp = 0;
        if (value < 0) {
          minValue = minValue > value ? 0.5 * Math.floor(value / 0.5) - 0.5 : minValue;
        } else {
          maxValue = maxValue < value ? 0.5 * Math.floor(value / 0.5) + 0.5 : maxValue;
        }
      }
      const alias = seriesRatioName[1];
      const name = seriesRatioName[2];
      data.push({
        key,
        value,
        name,
        alias
      });
      xDomain.push(alias);
    }
  }
</script>

<div class="card {className}">
  <div class="card-header header-elements-sm-inline py-sm-0">
    <h6 class="card-title py-sm-3">RATIO</h6>
  </div>
  <div class="card-body" style="height: 200px">
    {#if dataLoading}
      <IconSpinner />
    {:else}
      <ChartContainer
        y="value"
        x="alias"
        {data}
        xScale={scaleBand().paddingInner([0.3]).round(true)}
        {xDomain}
        yDomain={[minValue, maxValue]}
        padding={{ top: 10, bottom: 10, left: 60 }}
      >
        <Svg>
          <AxisX gridlines={false} baseline />
          <AxisY ticks={4} dxTick={10} formatTick={formatTickY} />
          <Column />
        </Svg>
        <Html>
          <Tooltip formatValue={formatTickY} />
        </Html>
      </ChartContainer>
    {/if}
  </div>
</div>
