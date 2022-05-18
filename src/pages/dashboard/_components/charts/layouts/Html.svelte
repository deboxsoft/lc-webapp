<!--
	@component
	HTML layout component
 -->
<script>
  import { getContextChart } from "__@stores/chart";

  /** @type {Element} [element] The layer's outermost `<div>` tag. Useful for bindings. */
  export let element = undefined;

  /** @type {Number} [zIndex] The layer's z-index. */
  export let zIndex = undefined;

  /** @type {Boolean} [pointerEvents] Set this to `false` to set `pointer-events: none;` on the entire layer. */
  export let pointerEvents = undefined;

  /** overwrite padding container **/
  export let padding = undefined;

  const { padding: paddingContainer } = getContextChart();
</script>

<div
  bind:this={element}
  class="chart-layout-html"
  style:z-index={zIndex}
  style:pointer-events={pointerEvents === false ? "none" : null}
  style:top={isFinite(padding?.top) ? padding.top : $paddingContainer.top + "px"}
  style:right={isFinite(padding?.right) ? padding.right : $paddingContainer.right + "px"}
  style:bottom={isFinite(padding?.bottom) ? padding.bottom : $paddingContainer.bottom + "px"}
  style:left={isFinite(padding?.left) ? padding.left : $paddingContainer.left + "px"}
>
  <slot {element} />
</div>

<style>
  div,
  slot {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
