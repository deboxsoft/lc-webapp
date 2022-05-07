<script>
  import { getContextChart } from "./ChartContainer.svelte";
  const { data, xGet, yGet, zGet, xScale } = getContextChart();
</script>

<g class="bar-group">
  {#each $data as series, i}
    {#each series as d}
      {@const yVals = $yGet(d)}
      {@const columnHeight = yVals[0] - yVals[1]}
      <rect
        class="group-rect"
        data-id={i}
        x={$xGet(d)}
        y={yVals[1]}
        width={$xScale.bandwidth()}
        height={columnHeight}
        fill={$zGet(series)}
      />
    {/each}
  {/each}
</g>
