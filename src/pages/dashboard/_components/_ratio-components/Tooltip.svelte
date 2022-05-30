<script>
  import { dateLocaleData } from "@deboxsoft/accounting-api";
  import { getContextChart } from "__@stores/chart";
  import QuadTree from "../charts/QuadTree.svelte";

  const { width, yScale, data, config, padding, xScale, yGet, yRange } = getContextChart();
  let w = 250,
    h = 250;
  $: w2 = w / 2;

  /**
   * @type {number} - A y-offset from hover point, in pixels.
   */
  export let offset = 10;
  export let formatValue = (d) => d;
  export let formatKey = (d) => d.toUpperCase();
  const formatTitle = (d) => dateLocaleData.months()[d - 1].toUpperCase();

  function parsingData(_data) {
    return {
      month: _data.month,
      value: _data.value
    };
  }
</script>

<QuadTree dataset={$data} let:x let:y let:visible let:found let:e>
  {@const _data = parsingData(found)}
  {@const _barOffset = $xScale.bandwidth() / 2}
  {@const _dy = $yScale(_data)}
  {@const _x = x + _barOffset}
  {#if visible === true}
    <!--line-->
    <div style:left="{_x}px" class="chart-line" />

    <!--  tooltip-->
    <div
      class="chart-tooltip"
      style:display={visible ? "block" : "none"}
      style:top="{y - offset}px"
      style:left="{Math.min(Math.max(_x, w2), $width - w2)}px"
      bind:clientWidth={w}
      bind:clientHeight={h}
    >
      <div class="chart-title">{formatTitle(_data.month)}</div>
      <div class="chart-title">Nilai Rasio: {formatValue(_data.value)}</div>
    </div>
  {/if}
</QuadTree>

<style>
  .chart-tooltip {
    border: 1px solid #ccc;
    background: rgba(255, 255, 255, 0.85);
    transform: translate(-50%, -100%);
    padding: 5px;
    z-index: 950;
  }

  .chart-line {
    top: 0;
    bottom: 0;
    width: 1px;
    border-left: 1px dotted #666;
  }

  .chart-tooltip,
  .chart-line {
    position: absolute;
    pointer-events: none;
    transition: left 250ms ease-out, top 250ms ease-out;
  }
  .chart-title {
    font-weight: bold;
  }

  .chart-value.-minus {
    color: red;
  }
</style>
