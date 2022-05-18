<script>
  import { getContextChart } from "__@stores/chart";
  // import { max } from "d3-array";
  import QuadTree from "../charts/QuadTree.svelte";

  const { width, yScale, data, config, padding } = getContextChart();
  let w = 250,
    h = 250;
  $: w2 = w / 2;

  /**
   * @type {number} - A y-offset from hover point, in pixels.
   */
  export let offset = 0;
  export let formatTitle = (d) => d.toUpperCase();
  export let formatValue = (d) => d;
  export let formatKey = (d) => d.toUpperCase();

  function sort(_data, e) {
    if (Object.keys(_data).length === 0) {
      return [];
    }
    return Object.keys(_data)
      .filter((d) => d !== $config.x)
      .map((key) => {
        return {
          key,
          value: _data[key]
        };
      });
  }

  $: dataset = $data.reduce((res, _) => {
    let i = 0;
    for (const value of _.values) {
      if (!res[i]) {
        res[i] = {};
      }
      res[i][$config.x] = value.month;
      res[i][_.label] = value.values;
      i++;
    }
    return res;
  }, []);
</script>

<QuadTree {dataset} y="x" let:x let:y let:visible let:found let:e>
  {@const foundSorted = sort(found, e)}
  {@const _dy = e.layerY}
  <!--{@const _dy = $yScale(max(foundSorted, (d) => d.value))}-->
  {#if visible === true}
    <!--line-->
    <div style:left="{x}px" style:top="{$padding.top}px" class="chart-line" />

    <!--  tooltip-->
    <div
      class="chart-tooltip"
      style:display={visible ? "block" : "none"}
      style:top="{_dy < h ? offset + h + _dy + 10 : offset + _dy}px"
      style:left="{Math.min(Math.max(x, w2), $width - w2)}px"
      bind:clientWidth={w}
      bind:clientHeight={h}
    >
      <div class="chart-title">{formatTitle(found[$config.x])}</div>
      {#each foundSorted as row}
        <div class="chart-row">
          <span class="chart-key">
            {formatKey(row.key)}:
          </span>
          <span class="chart-value" class:-minus={0 > row.value}>
            {formatValue(row.value)}
          </span>
        </div>
      {/each}
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
