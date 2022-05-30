<script>
  import { getContextChart } from "__@stores/chart";
  import { line, curveLinear } from "d3-shape";
  import TooltipPoint from "__@root/pages/dashboard/_components/charts/TooltipPoint.svelte";
  import { createEventDispatcher } from "svelte";
  import { undefined } from "@deboxsoft/zod";

  const dispatch = createEventDispatcher();
  const { data, xGet, yGet, zGet } = getContextChart();
  /** @type {Function} [curve=curveLinear] - An optional D3 interpolation function. See [d3-shape](https://github.com/d3/d3-shape#curves) for options. Pass this function in uncalled, i.e. without the open-close parentheses. */
  export let curve = curveLinear;
  /**
   * @type {false | string}
   */
  export let dotStroke = false;
  /**
   * @type {false | string}
   */
  export let dotFill = false;
  export let dotDisable = false;
  export let dotOptions = {
    radius: 3,
    radiusHover: 4
  };

  $: path = line().x($xGet).y($yGet).curve(curve);

  function createTooltipMouseOverHandle(_data, point = {}) {
    return (e) => {
      dispatch("tooltip-over", { e, data: _data, ...point });
    };
  }

  function tooltipMouseOutHandle() {
    dispatch("tooltip-out", undefined);
  }
</script>

<g class="line-group">
  {#each $data as { values, ...group }}
    <path class="path-line" d={path(values)} stroke={$zGet(group)} />
    {#if !dotDisable}
      <g>
        {#each values as dotItem}
          {@const cx = $xGet(dotItem)}
          {@const cy = $yGet(dotItem)}
          {@const cz = $zGet(group)}
          <TooltipPoint
            class="d3-line-circle d3-line-circle-medium"
            {cx}
            {cy}
            stroke={dotStroke || cz}
            fill={dotFill || cz}
            on:mouseover={createTooltipMouseOverHandle({ ...dotItem, ...group }, { x: cx, y: cy })}
            on:mouseout={tooltipMouseOutHandle}
          />
        {/each}
      </g>
    {/if}
  {/each}
</g>

<style>
  .path-line {
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 3px;
    transition: left 1000ms ease-out, top 1000ms ease-out;
  }
</style>
