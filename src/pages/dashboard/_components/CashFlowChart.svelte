<script>
  import { scaleOrdinal } from "d3-scale";
  import { stores } from "@deboxsoft/accounting-client";
  import ComboxField from "__@comps/forms/ComboxField.svelte";
  import InputCheckSwitchery from "__@comps/forms/InputCheckSwitchery.svelte";
  import ChartContainer from "./charts/ChartContainer.svelte";
  import Svg from "./charts/layouts/Svg.svelte";
  import Html from "./charts/layouts/Html.svelte";
  import AxisY from "./charts/AxisY.svelte";
  import AxisX from "./charts/AxisX.svelte";
  import Multiline from "./charts/MultiLine.svelte";
  import Tooltip from "./_cash-flow/Tooltip.svelte";
  import Legend from "./_cash-flow/Legend.svelte";
  import { dateLocaleData } from "@deboxsoft/accounting-api";
  import IconSpinner from "__@comps/loader/IconSpinner.svelte";
  import { createContextChart } from "__@stores/chart";
  import { formatCurrency } from "__@root/utils";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  const { getMonthlyBalanceReport } = stores.getBalanceReportContext();

  const fixedMonthlyBalanceReportStore = getMonthlyBalanceReport();
  const currentMonthlyBalanceReportStore = getMonthlyBalanceReport(true);
  export let dataLoading = true;
  const className = $$props.class || "";
  const selectOptions = [
    {
      id: "period",
      label: "Tahun Ini"
    },
    {
      id: "month",
      label: "Bulan Ini"
    },
    {
      id: "week",
      label: "Minggu Ini"
    }
  ];
  let mounted = false;
  const seriesNames = [
    { id: "revenue", label: "PENDAPATAN", color: "#019688" },
    { id: "expense", label: "BIAYA", color: "#E91D62" },
    { id: "profit", label: "LABA", color: "#2096F3" }
  ];
  const xKey = "month";
  const yKey = "values";
  const zKey = "label";
  const months = dateLocaleData.months();
  let tooltipDataSet = [],
    isAccumulation = false;
  const dataStore = writable([]);

  const context = createContextChart({
    x: xKey,
    y: yKey,
    z: zKey,
    padding: {
      top: 48,
      bottom: 30,
      left: 10
    },
    zScale: scaleOrdinal(),
    zDomain: seriesNames.map((_) => _.label),
    zRange: seriesNames.map((_) => _.color)
  });

  onMount(() => {
    mounted = true;
  });

  $: {
    if (mounted && $dataStore) {
      processingData();
    }
  }

  $: {
    if (isAccumulation) {
      $dataStore = $currentMonthlyBalanceReportStore;
    } else {
      $dataStore = $fixedMonthlyBalanceReportStore;
    }
  }

  function processingData() {
    dataLoading = true;
    tooltipDataSet = [];
    const data = [],
      flatData = [];
    let _maxVal = 1000;
    let _minVal = 0;
    const xDomain = [1, 12];
    for (const series of seriesNames) {
      data.push({
        id: series.id,
        label: series.label,
        values: $dataStore.map((d) => {
          const _val = d.data[series.id];
          _maxVal = Math.max(_maxVal, _val);
          _minVal = Math.min(_minVal, _val);
          const _data = {
            [xKey]: d.month,
            [yKey]: d.data[series.id]
          };
          flatData.push(_data);
          return _data;
        })
      });
    }
    context.setXDomain(xDomain);
    context.setYDomain([_minVal, _maxVal]);
    context.setFlatData(flatData);
    context.setData(data);
    dataLoading = false;
  }

  let tooltipEvt;
  const formatTickY = (d) => formatCurrency(d);
  const formatTickX = (d) => {
    return months[d - 1].toUpperCase();
  };
</script>

<div class="card {className}">
  <div class="card-header header-elements-sm-inline py-sm-0">
    <h6 class="card-title py-sm-3">CASHFLOW OPERASIONAL</h6>
    <div class="header-elements">
      <InputCheckSwitchery
        class="mt-auto mb-auto mr-2"
        name="isAccumulation"
        label="Akumulasi Saldo"
        bind:checked={isAccumulation}
      />
      <!--      <a href="#" disabled class="list-icons-item mr-2">-->
      <!--        <i class="icon-reset" />-->
      <!--      </a>-->
      <!--      <ComboxField items={selectOptions} style="width: unset" />-->
    </div>
  </div>
  <div class="card-body" style="height: 300px">
    {#if dataLoading}
      <IconSpinner />
    {:else}
      <ChartContainer {context}>
        <Svg>
          <AxisX snapTicks tickMarks formatTick={formatTickX} ticks={12} baseline />
          <AxisY formatTick={formatTickY} />
          <Multiline />
        </Svg>
        <Html padding={{ top: 10 }}>
          <svg style="position: absolute;left: 50%; transform: translateX(-50%)">
            <Legend />
          </svg>
          <Tooltip formatValue={formatTickY} formatTitle={formatTickX} />
        </Html>
      </ChartContainer>
    {/if}
  </div>
</div>
