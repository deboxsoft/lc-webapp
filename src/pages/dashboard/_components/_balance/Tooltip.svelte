<script>
  import QuadTree from "../charts/QuadTree.svelte";
  import { getContextChart } from "__@stores/chart";
  import { dateLocaleData } from "@deboxsoft/accounting-api";
  import { formatCurrency } from "__@root/utils";

  const { width, height, yScale, data, config, padding, xScale, yGet, yRange } = getContextChart();
  let w, h;
  const months = dateLocaleData.monthsShort();
  const offset = {
    x: 0,
    y: 0
  };

  function parsingData(_data) {
    return {
      month: months[_data.month - 1],
      value: formatCurrency(_data.data)
    };
  }
</script>

<QuadTree dataset={$data} let:x let:y let:visible let:found let:e>
  {@const data = parsingData(found)}
  <!--line-->
  <div style:left="{x}px" class="tooltip-line" />
  <div
    class="tooltip-container"
    style:display={visible ? "block" : "none"}
    style:left="{x + 1 < $width - w ? x : x - w}px"
    style:top="{Math.min(y, $height - h)}px"
    bind:clientWidth={w}
    bind:clientHeight={h}
  >
    {data.month}: {data.value}
  </div>
</QuadTree>

<style>
  .tooltip-container,
  .tooltip-line {
    position: absolute;
    pointer-events: none;
    transition: left 250ms ease-out, top 250ms ease-out;
  }
  .tooltip-container {
    position: absolute;
    pointer-events: none;
    display: block;
    box-sizing: border-box;
    background-color: #000;
    padding: 0.5rem 0.75rem;
    font-size: 0.625rem;
    color: #fff;
    z-index: 1070;
  }

  .tooltip-line {
    top: 0;
    bottom: 0;
    width: 1px;
    border-left: 1px dotted #fff;
  }
</style>
