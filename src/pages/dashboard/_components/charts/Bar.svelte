<script>
  import { getContextChart } from "./ChartContainer.svelte";
  const { data, xGet, yGet, xScale, yScale } = getContextChart();
  export let fill = "#00bbff";
</script>

<g class="bar-group">
  {#each $data as d, i}
    <rect
      class="group-rect"
      data-id={i}
      x={$xScale.range()[0]}
      y={$yGet(d)}
      height={$yScale.bandwidth()}
      width={$xGet(d)}
      {fill}
    />
  {/each}
</g>
