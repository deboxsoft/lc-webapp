<script>
  import { dateLocaleData, seriesRatioNames } from "@deboxsoft/accounting-api";
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
  import IconSpinner from "__@comps/loader/IconSpinner.svelte";
  import ComboxField from "__@comps/forms/ComboxField.svelte";
  import { createContextChart } from "__@stores/chart";
  import { onMount } from "svelte";

  const { getMonthlyBalanceReport } = stores.getBalanceReportContext();
  const dataStore = getMonthlyBalanceReport();
  let dataLoading = true;
  const className = $$props.class || "";
  let mounted = false;
  let seriesRatioName = seriesRatioNames[0];
  const months = dateLocaleData.monthsShort();
  let isAccumulation = false;

  const context = createContextChart({
    x: "month",
    y: "value",
    xScale: scaleBand().paddingInner([0.3]).round(true),
    padding: {
      top: 10,
      bottom: 10,
      left: 10
    }
  });
  onMount(() => {
    mounted = true;
  });

  $: {
    if (mounted && $dataStore && seriesRatioName) {
      processingData();
    }
  }

  const formatTickY = (d) => format(".0%")(d);
  const formatTickX = (d) => {
    return dateLocaleData.monthsShort()[d - 1].toUpperCase();
  };
  const formatTitleTooltip = (d) => {
    return dateLocaleData.months()[d - 1].toUpperCase();
  };

  function processingData() {
    dataLoading = true;
    const data = [];
    let minValue = 0,
      maxValue = 1;
    for (const _data of $dataStore) {
      const month = _data.month;
      let value = _data.data.ratio[seriesRatioName[0]] || 0;
      if (isFinite(value)) {
        let _tmp = 0;
        if (value < 0) {
          minValue = minValue > value ? 0.5 * Math.floor(value / 0.5) - 0.5 : minValue;
        } else {
          maxValue = maxValue < value ? 0.5 * Math.floor(value / 0.5) + 0.5 : maxValue;
        }
      }
      data.push({
        month,
        value
      });
    }
    context.setYDomain([minValue, maxValue]);
    context.setXDomain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    context.setData(data);
    dataLoading = false;
  }

  function ratioSelectHandler({ detail }) {
    seriesRatioName = detail;
  }
</script>

<div class="card {className}">
  <div class="card-header header-elements-sm-inline py-sm-0">
    <h6 class="card-title py-sm-3">{seriesRatioName[2]}</h6>
    <div class="header-elements">
      <ComboxField
        on:change={ratioSelectHandler}
        items={seriesRatioNames}
        labelFunc={(_) => _[2]}
        valueFunc={(_) => _}
        style="width: unset"
      />
    </div>
  </div>
  <div class="card-body" style="height: 200px">
    {#if dataLoading}
      <IconSpinner />
    {:else}
      <ChartContainer {context}>
        <Svg>
          <AxisX gridlines={false} baseline formatTick={formatTickX} />
          <AxisY ticks={4} dxTick={10} formatTick={formatTickY} />
          <Column />
        </Svg>
        <Html>
          <Tooltip formatValue={formatTickY} formatTitle={formatTitleTooltip} />
        </Html>
      </ChartContainer>
    {/if}
  </div>
</div>
