<script>
  import { linear } from "svelte/easing";
  import { fade } from "svelte/transition";
  export let cx = 0;
  export let cy = 0;
  export let stroke = "#fff";
  export let fill = "#fff";
  export let radius = 3;
  export let hoverRadius = 4;
  const className = $$props.class;

  $: _radius = radius;

  /**
   *
   * @param e {MouseEvent}
   */
  function dotMouseOverHandler(e) {
    _radius = hoverRadius;
  }

  /**
   *
   * @param e {MouseEvent}
   */
  function dotMouseOutHandler(e) {
    _radius = radius;
  }
</script>

<circle
  class="point {className}"
  {cx}
  {cy}
  r={_radius}
  on:mouseover={dotMouseOverHandler}
  on:mouseout={dotMouseOutHandler}
  style="--fill-color:{fill};--stroke-color:{stroke}"
  in:fade={{ duration: 500, ease: linear }}
  on:mouseover
  on:mouseout
/>

<style>
  .point {
    stroke: var(--stroke-color);
    fill: var(--fill-color);
  }

  .point .path-line {
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 2;
  }
</style>
