<script>
  export let xTicks = [],
    yTicks = [];
  export let xScale, yScale;
  export let width, height, padding;
  export let xLabelFunc = (l) => l;
  export let yLabelFunc = (l) => l;
</script>

<g class="axis y-axis" transform="translate(0,{padding.top})">
  {#each yTicks as tick}
    <g class="tick tick-{tick}" transform="translate(10,{ yScale(tick)- padding.bottom})">
      <line x2="100%" />
      <text>{yLabelFunc(tick)}</text>
    </g>
  {/each}
</g>

<g class="axis x-axis">
  {#each xTicks as tick}
    <g class="tick tick-{tick}" transform="translate({xScale(tick),{height}})">
      <text x="{bar}"
    </g>
  {/each}
</g>
