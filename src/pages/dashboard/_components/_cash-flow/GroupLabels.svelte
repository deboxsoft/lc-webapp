<script>
  import { getContextChart } from "__@stores/chart";
  import { max } from "d3-array";

  const { data, x, yGet, xScale, yScale, xRange, yRange, z } = getContextChart();

  $: left = (values) => $xScale(max(values, $x)) / Math.max(...$xRange);
  $: top = (values) => $yGet(values[values.length - 1]) / Math.max(...$yRange);
</script>

{#each $data as group}
  <div class="label" style:top="{top(group.values) * 100}%" style:left="{left(group.values) * 100}%">
    {$z(group)}
  </div>
{/each}

<style>
  .label {
    position: absolute;
    transform: translate(-100%, -100%) translateY(1px);
    font-size: 13px;
  }
</style>
