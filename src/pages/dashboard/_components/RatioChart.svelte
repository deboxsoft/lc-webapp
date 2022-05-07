<script>
  import { seriesRatioNames } from "@deboxsoft/accounting-api";
  import ChartContainer from "./charts/ChartContainer.svelte";
  import Svg from "./charts/layouts/Svg.svelte";
  import AxisY from "./charts/AxisY.svelte";
  import AxisX from "./charts/AxisX.svelte";
  import ColumnStacked from "./charts/ColumnStacked.svelte";
  import uniques from "./charts/lib/uniques";

  import { format } from "d3-format";
  import { scaleBand, scaleOrdinal } from "d3-scale";
  import { stack } from "d3-shape";

  const className = $$props.class || "";

  /**
   * @type {HTMLElement}
   */
  let containerEl, tooltipEvt;
  let loading = false;

  const formatTickY = (d) => format(".0%");
  const stackData = stack().keys();
</script>

<div class="card {className}">
  <div class="card-header header-elements-sm-inline py-sm-0">
    <h6 class="card-title py-sm-3">RATIO</h6>
  </div>
  <div class="card-body">
    <ChartContainer>
      <Svg>
        <AxisX />
        <AxisY />
        <ColumnStacked />
      </Svg>
    </ChartContainer>
  </div>
</div>
