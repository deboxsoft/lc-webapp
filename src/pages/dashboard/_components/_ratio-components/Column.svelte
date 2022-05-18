<script>
  import { getContextChart } from "__@stores/chart";

  const { data, xGet, yGet, yRange, xScale } = getContextChart();

  /** @type {String} [fill='#00e047'] - The shape's fill color. */
  export let fill = "#00e047";

  /** @type {String} [stroke='#000'] - The shape's stroke color. */
  export let stroke = "#000";

  /** @type {Number} [strokeWidth=0] - The shape's stroke width. */
  export let strokeWidth = 0;

  $: columnHeight = (d) => {
    return $yRange[0] - $yGet(d);
  };

  $: columnWidth = (d) => {
    const vals = $xGet(d);
    return Math.max(0, vals[1] - vals[0]);
  };
</script>

<g class="column-group">
  {#each $data as d, i}
    {@const _columnHeight = columnHeight(d)}
    {#if isFinite(_columnHeight)}
      <rect
        class="group-rect"
        data-id={i}
        x={$xScale.bandwidth ? $xGet(d) : $xGet(d)[0]}
        y={$yGet(d)}
        width={$xScale.bandwidth ? $xScale.bandwidth() : columnWidth(d)}
        height={_columnHeight}
        {fill}
        {stroke}
        stroke-width={strokeWidth}
      />
    {/if}
  {/each}
</g>
