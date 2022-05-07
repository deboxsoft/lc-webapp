<script>
  import { getContextChart } from "./ChartContainer.svelte";
  import { writable } from "svelte/store";
  import TooltipPoint from "./TooltipPoint.svelte";
  import { fly } from "svelte/transition";
  import { linear } from "svelte/easing";
  import { createEventDispatcher } from "svelte";

  const { data, xGet, yGet } = getContextChart();
  /** @type {String} [stroke='#000'] */
  export let stroke = "#000";
  export let dotFill = stroke;
  export let dotDisable = false;
  export let dotOptions = {
    radius: 3,
    radiusHover: 4
  };
  const _dotRadius = writable(dotOptions.radius);
  const dispatch = createEventDispatcher();
  $: path =
    ($data.length > 0 ? "M" : "") +
    $data
      .map((d) => {
        return $xGet(d) + "," + $yGet(d);
      })
      .join("L");

  function createTooltipMouseOverHandle(_data, point = {}) {
    return (e) => {
      dispatch("tooltip-over", { e, data: _data, ...point });
    };
  }

  function tooltipMouseOutHandle() {
    dispatch("tooltip-out", undefined);
  }
</script>

<path class="path-line" d={path} {stroke} in:fly={{ duration: 1000, ease: linear }} />
{#if !dotDisable}
  <g>
    {#each $data as dotItem}
      {@const cx = $xGet(dotItem)}
      {@const cy = $yGet(dotItem)}
      <TooltipPoint
        class="d3-line-circle d3-line-circle-medium"
        {cx}
        {cy}
        on:mouseover={createTooltipMouseOverHandle(dotItem, { x: cx, y: cy })}
        on:mouseout={tooltipMouseOutHandle}
      />
    {/each}
  </g>
{/if}

<style>
  .path-line {
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 2;
  }
</style>
