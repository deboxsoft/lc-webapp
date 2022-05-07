<script>
  import { convertToNumber } from "__@root/utils";
  import { onMount } from "svelte";
  import ChartContainer from "./charts/ChartContainer.svelte";
  import Svg from "./charts/layouts/Svg.svelte";
  import Line from "./charts/Line.svelte";
  import { derived, writable } from "svelte/store";
  import Card from "./CardChart.svelte";
  import AxisX from "./charts/AxisX.svelte";
  import Tooltip from "./charts/Tooltip.svelte";

  /**
   * @type{import("svelte/store").Writable<PeriodBalanceReport>}
   */
  export let periodBalanceReport = writable({
    data: [
      {
        balance: { cash: 12000, assets: 3000 },
        data: [{ cash: 100 }, { cash: 400 }, { cash: 500 }, { cash: 600 }]
      },
      {
        balance: { cash: 5000, assets: 3000 }
      },
      {
        balance: { cash: 7000, assets: 3000 }
      },
      {
        balance: { cash: 7000, assets: 3000 }
      },
      {
        balance: { cash: 7000, assets: 3000 }
      },
      {
        balance: { cash: 7000, assets: 3000 }
      },
      {
        balance: { cash: 7000, assets: 3000 }
      },
      {
        balance: { cash: 7000, assets: 3000 }
      },
      {
        balance: { cash: 2000, assets: 3000 }
      }
    ]
  });

  export let label;
  export let value;
  /**
   * @type {HTMLElement}
   */
  let containerEl,
    tooltipEvt,
    loading = false;
  let widthContainerChart;
  let width;
  let isMount = false;
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
  const data = derived(periodBalanceReport, (_periodBalanceStore) => {
    return _periodBalanceStore.data.map((_, i) => {
      const value = _?.balance?.cash || 0;
      return {
        month: i,
        value
      };
    });
  });

  const className = $$props.class || "";

  onMount(() => {
    isMount = true;
  });

  // periodBalanceReport.data.
  function setValueCurrency(_value) {
    return convertToNumber({ value: _value, fractionDigits: 2, thousandSeparator: ".", decimalSeparator: "," });
  }
</script>

<Card class={className} {label} {value} {loading}>
  <div class="container-fluid" style="height: 50px">
    <ChartContainer x="month" y="value" data={$data} yDomain={[0, null]} xDomain={[0, 12]}>
      <Tooltip evt={tooltipEvt}>
        {#if tooltipEvt?.detail?.data}
          {months[tooltipEvt.detail.data.month]}: Rp. {setValueCurrency(tooltipEvt.detail.data.value)}
        {/if}
      </Tooltip>
      <Svg>
        <AxisX labelDisable />
        <Line
          stroke="#fff"
          on:tooltip-over={(e) => {
            tooltipEvt = e;
          }}
          on:tooltip-out={(e) => {
            tooltipEvt = e;
          }}
        />
      </Svg>
    </ChartContainer>
  </div>
</Card>
