<script>
  import { stores } from "@deboxsoft/accounting-client";
  import ComboxField from "__@comps/forms/ComboxField.svelte";
  import InputCheckSwitchery from "__@comps/forms/InputCheckSwitchery.svelte";
  import ChartContainer from "./charts/ChartContainer.svelte";
  import Svg from "./charts/layouts/Svg.svelte";
  import Html from "./charts/layouts/Html.svelte";
  import AxisY from "./charts/AxisY.svelte";
  import AxisX from "./charts/AxisX.svelte";
  import Tooltip from "./_account/Tooltip.svelte";
  import { dateLocaleData } from "@deboxsoft/accounting-api";
  import IconSpinner from "__@comps/loader/IconSpinner.svelte";
  import { createContextChart } from "__@stores/chart";
  import { filteringAccountExpense, formatCurrency } from "__@root/utils";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import Line from "./charts/Line.svelte";

  const { getMonthlyBalanceReport } = stores.getBalanceReportContext();
  const { getAccountLeaf } = stores.getAccountContext();

  const fixedMonthlyBalanceReportStore = getMonthlyBalanceReport();
  const currentMonthlyBalanceReportStore = getMonthlyBalanceReport(true);
  export let dataLoading = true;
  const className = $$props.class || "";
  const accountStore = filteringAccountExpense(getAccountLeaf());
  let accountSelect = undefined;
  let mounted = false;
  const xKey = "month";
  const yKey = "value";
  const monthsShort = dateLocaleData.monthsShort();
  const months = dateLocaleData.months();
  let isAccumulation = false;

  /**
   * @type {Writable<import("@deboxsoft/accounting-api").MonthBalanceReport[]>}
   */
  const dataStore = writable([]);

  const context = createContextChart({
    x: xKey,
    y: yKey,
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
    if (mounted && $dataStore) {
      const _accountId = accountSelect?.id;
      processingData(_accountId);
    }
  }

  $: {
    if (isAccumulation) {
      $dataStore = $currentMonthlyBalanceReportStore;
    } else {
      $dataStore = $fixedMonthlyBalanceReportStore;
    }
  }

  $: title = accountSelect ? accountSelect.name.toUpperCase() : "BIAYA";

  function processingData(accountId, keyBalanceReport = "expense") {
    dataLoading = true;
    const data = [],
      flatData = [];
    let _maxVal = 1000;
    let _minVal = 0;
    const xDomain = [1, 12];
    for (const monthBalanceReport of $dataStore) {
      const month = monthBalanceReport.month;
      const value = accountId
        ? monthBalanceReport.data[`${keyBalanceReport}Data`][accountId] || 0
        : monthBalanceReport.data[keyBalanceReport];
      _maxVal = Math.max(_maxVal, value);
      _minVal = Math.min(_minVal, value);
      data.push({
        month,
        value
      });
    }
    context.setXDomain(xDomain);
    context.setYDomain([_minVal, _maxVal]);
    context.setData(data);
    dataLoading = false;
  }

  let tooltipEvt;
  const formatTickY = (d) => formatCurrency(d);
  const formatTickX = (d) => monthsShort[d - 1].toUpperCase();
  const formatTooltipTitle = (d) => months[d - 1].toUpperCase();

  function accountSelectHandler({ detail }) {
    accountSelect = detail ? detail : undefined;
  }
</script>

<div class="card {className}">
  <div class="card-header header-elements-sm-inline py-sm-0">
    <h6 class="card-title py-sm-3">{title}</h6>
    <div class="header-elements">
      <InputCheckSwitchery
        class="mt-auto mb-auto mr-2"
        name="isAccumulation"
        label="Akumulasi Saldo"
        bind:checked={isAccumulation}
      />
      <ComboxField
        on:change={accountSelectHandler}
        items={$accountStore}
        labelId="name"
        allowEmpty
        style="width: unset"
      />
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
          <Line stroke="#E91D62" />
        </Svg>
        <Html>
          <Tooltip formatValue={formatTickY} formatTitle={formatTickX} />
        </Html>
      </ChartContainer>
    {/if}
  </div>
</div>
