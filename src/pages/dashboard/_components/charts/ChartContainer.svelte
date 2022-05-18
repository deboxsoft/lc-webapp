<script>
  import { onMount, tick } from "svelte";
  import { createContextChart } from "__@stores/chart";

  /** @type {Boolean} [ssr=false] Whether this chart should be rendered server side. */
  export let ssr = false;
  /** @type {Boolean} [pointerEvents=true] Whether to allow pointer events via CSS. Set this to `false` to set `pointer-events: none;` on all components, disabling all mouse interaction. */
  export let pointerEvents = true;
  /** @type {String} [position='relative'] Determine the positioning of the wrapper div. Set this to `'absolute'` when you want to stack cakes. */
  export let position = "relative";
  /** @type {Boolean} [percentRange=false] If `true`, set all scale ranges to `[0, 100]`. Ranges reversed via `xReverse`, `yReverse`, `zReverse` or `rReverse` props will continue to be reversed as usual. */
  export let percentRange = false;

  /** @type {Number} [width=containerWidth] Override the automated width. */
  export let width = undefined;
  /** @type {Number} [height=containerHeight] Override the automated height. */
  export let height = undefined;

  /** @type {Number} [containerWidth=100] The bound container width. */
  export let containerWidth = width || 100;
  /** @type {Number} [containerHeight=100] The bound container height. */
  export let containerHeight = height || 100;

  /**	@type {Element} [element] The .layercake-container `<div>` tag. Useful for bindings. */
  export let element = undefined;

  /* --------------------------------------------
   * Parameters
   * Values that computed properties are based on and that
   * can be easily extended from config values
   *
   */

  /** @type {String|Function|Number|Array} x The x accessor. The key in each row of data that corresponds to the x-field. This can be a string, an accessor function, a number or an array of any combination of those types. This property gets converted to a function when you access it through the context. */
  export let x = (d) => d;
  /** @type {String|Function|Number|Array} y The y accessor. The key in each row of data that corresponds to the y-field. This can be a string, an accessor function, a number or an array of any combination of those types. This property gets converted to a function when you access it through the context. */
  export let y = (d) => d;
  /** @type {String|Function|Number|Array} z The z accessor. The key in each row of data that corresponds to the z-field. This can be a string, an accessor function, a number or an array of any combination of those types. This property gets converted to a function when you access it through the context. */
  export let z = (d) => d;
  /** @type {String|Function|Number|Array} r The r accessor. The key in each row of data that corresponds to the r-field. This can be a string, an accessor function, a number or an array of any combination of those types. This property gets converted to a function when you access it through the context. */
  export let r = (d) => d;

  /** @type {Array|Object} [data=[]] If `data` is not a flat array of objects and you want to use any of the scales, set a flat version of the data via the `flatData` prop. */
  export let data = [];

  /** @type {[min: ?Number, max: ?Number]|String[]|Number[]} [xDomain] Set a min or max. For linear scales, if you want to inherit the value from the data's extent, set that value to `null`. This value can also be an array because sometimes your scales are [piecewise](https://github.com/d3/d3-scale#continuous_domain) or are a list of discrete values such as in [ordinal scales](https://github.com/d3/d3-scale#ordinal-scales), useful for color series.*/
  export let xDomain = undefined;
  /** @type {[min: ?Number, max: ?Number]|String[]|Number[]} [yDomain] Set a min or max. For linear scales, if you want to inherit the value from the data's extent, set that value to `null`.*/
  export let yDomain = undefined;
  /** @type {[min: ?Number, max: ?Number]|String[]|Number[]} [zDomain] Set a min or max. For linear scales, if you want to inherit the value from the data's extent, set that value to `null`. This value can also be an array because sometimes your scales are [piecewise](https://github.com/d3/d3-scale#continuous_domain) or are a list of discrete values such as in [ordinal scales](https://github.com/d3/d3-scale#ordinal-scales), useful for color series.*/
  export let zDomain = undefined;
  /** @type {[min: ?Number, max: ?Number]|String[]|Number[]} [rDomain] Set a min or max. For linear scales, if you want to inherit the value from the data's extent, set that value to `null`. This value can also be an array because sometimes your scales are [piecewise](https://github.com/d3/d3-scale#continuous_domain) or are a list of discrete values such as in [ordinal scales](https://github.com/d3/d3-scale#ordinal-scales), useful for color series.*/
  export let rDomain = undefined;
  /** @type {Boolean} [xNice=false] Applies D3's [scale.nice()](https://github.com/d3/d3-scale#continuous_nice) to the x domain. */
  export let xNice = false;
  /** @type {Boolean} [yNice=false] Applies D3's [scale.nice()](https://github.com/d3/d3-scale#continuous_nice) to the y domain. */
  export let yNice = false;
  /** @type {Boolean} [zNice=false] Applies D3's [scale.nice()](https://github.com/d3/d3-scale#continuous_nice) to the z domain. */
  export let zNice = false;
  /** @type {Boolean} [rNice=false] Applies D3's [scale.nice()](https://github.com/d3/d3-scale#continuous_nice) to the r domain. */
  export let rNice = false;
  /** @type {Boolean} [xReverse=false] Reverse the default x range. By default this is `false` and the range is `[0, width]`. Ignored if you set the xRange prop. */
  export let xReverse = undefined;
  /** @type {Boolean} [yReverse=true] Reverse the default y range. By default this is `true` and the range is `[height, 0]`. Ignored if you set the yRange prop. */
  export let yReverse = undefined;
  /** @type {Boolean} [zReverse=false] Reverse the default z range. By default this is `false` and the range is `[0, width]`. Ignored if you set the zRange prop. */
  export let zReverse = undefined;
  /** @type {Boolean} [rReverse=false] Reverse the default r range. By default this is `false` and the range is `[1, 25]`.Ignored if you set the rRange prop. */
  export let rReverse = undefined;
  /** @type {[leftPixels: Number, rightPixels: Number]} [xPadding] Assign a pixel value to add to the min or max of the scale. This will increase the scales domain by the scale unit equivalent of the provided pixels. */
  export let xPadding = undefined;
  /** @type {[leftPixels: Number, rightPixels: Number]} [yPadding] Assign a pixel value to add to the min or max of the scale. This will increase the scales domain by the scale unit equivalent of the provided pixels. */
  export let yPadding = undefined;
  /** @type {[leftPixels: Number, rightPixels: Number]} [zPadding] Assign a pixel value to add to the min or max of the scale. This will increase the scales domain by the scale unit equivalent of the provided pixels. */
  export let zPadding = undefined;
  /** @type {[leftPixels: Number, rightPixels: Number]} [rPadding] Assign a pixel value to add to the min or max of the scale. This will increase the scales domain by the scale unit equivalent of the provided pixels. */
  export let rPadding = undefined;
  /** @type {Function} [xScale=d3.scaleLinear] The D3 scale that should be used for the x-dimension. Pass in an instantiated D3 scale if you want to override the default or you want to extra options. */
  export let xScale = undefined;
  /** @type {Function} [yScale=d3.scaleLinear] The D3 scale that should be used for the x-dimension. Pass in an instantiated D3 scale if you want to override the default or you want to extra options. */
  export let yScale = undefined;
  /** @type {Function} [zScale=d3.scaleLinear] The D3 scale that should be used for the x-dimension. Pass in an instantiated D3 scale if you want to override the default or you want to extra options. */
  export let zScale = undefined;
  /** @type {Function} [rScale=d3.scaleSqrt] The D3 scale that should be used for the x-dimension. Pass in an instantiated D3 scale if you want to override the default or you want to extra options. */
  export let rScale = undefined;
  /** @type {[min: Number, max: Number]|Function|String[]|Number[]} [xRange] Override the default x range of `[0, width]` by setting an array or function with argument `({ width, height})` that returns an array. Setting this prop overrides `xReverse`. This can also be a list of numbers or strings for scales with discrete ranges like [scaleThreshhold](https://github.com/d3/d3-scale#threshold-scales) or [scaleQuantize](https://github.com/d3/d3-scale#quantize-scales). */
  export let xRange = undefined;
  /** @type {[min: Number, max: Number]|Function|String[]|Number[]} [xRange] Override the default y range of `[0, height]` by setting an array or function with argument `({ width, height})` that returns an array. Setting this prop overrides `yReverse`. This can also be a list of numbers or strings for scales with discrete ranges like [scaleThreshhold](https://github.com/d3/d3-scale#threshold-scales) or [scaleQuantize](https://github.com/d3/d3-scale#quantize-scales). */
  export let yRange = undefined;
  /** @type {[min: Number, max: Number]|Function|String[]|Number[]} [zRange] Override the default z range of `[0, width]` by setting an array or function with argument `({ width, height})` that returns an array. Setting this prop overrides `zReverse`. This can also be a list of numbers or strings for scales with discrete ranges like [scaleThreshhold](https://github.com/d3/d3-scale#threshold-scales) or [scaleQuantize](https://github.com/d3/d3-scale#quantize-scales). */
  export let zRange = undefined;
  /** @type {[min: Number, max: Number]|Function|String[]|Number[]} [rRange] Override the default y range of `[1, 25]` by setting an array or function with argument `({ width, height})` that returns an array. Setting this prop overrides `rReverse`. This can also be a list of numbers or strings for scales with discrete ranges like [scaleThreshhold](https://github.com/d3/d3-scale#threshold-scales) or [scaleQuantize](https://github.com/d3/d3-scale#quantize-scales). */
  export let rRange = undefined;
  /** @type {{top?: Number, right?: Number, bottom?: Number, left?: Number}} [padding={}] The amount of padding to put around your chart. It operates like CSS box-sizing: border-box; where values are subtracted from the parent container's width and height, the same as a [D3 margin convention](https://bl.ocks.org/mbostock/3019563). */
  export let padding = {};
  /** @type {{ x?: [min: Number, max: Number], y?: [min: Number, max: Number], r?: [min: Number, max: Number], z?: [min: Number, max: Number] }} [extents] Manually set the extents of the x, y or r scale as a two-dimensional array of the min and max you want. Setting values here will skip any dynamic extent calculation of the data for that dimension. */
  export let extents = {};

  /** @type {Array} [flatData=data] A flat version of data. */
  export let flatData = undefined;

  /** @type {Object} custom Any extra configuration values you want available on the LayerCake context. This could be useful for color lookups or additional constants. */
  export let custom = {};

  export let context = createContextChart({
    percentRange,
    extents,
    data: flatData || data,
    padding,
    x,
    y,
    z,
    r,
    xDomain,
    yDomain,
    zDomain,
    rDomain,
    xNice,
    yNice,
    zNice,
    rNice,
    xReverse,
    yReverse,
    zReverse,
    rReverse,
    xPadding,
    yPadding,
    zPadding,
    rPadding,
    xRange,
    yRange,
    zRange,
    rRange,
    xScale,
    yScale,
    zScale,
    rScale
  });

  const width_d = context.width;
  const height_d = context.height;
  const aspectRatio_d = context.aspectRatio;
  const _containerWidth = context.containerWidth;
  const _containerHeight = context.containerHeight;

  onMount(() => {
    context.setMounted(true);
  });
  $: context.setContainerHeight(containerHeight);
  $: context.setContainerWidth(containerWidth);
</script>

{#if ssr === true || typeof window !== "undefined"}
  <div
    bind:this={element}
    class="chart-container"
    style:position
    style:top={position === "absolute" ? "0" : null}
    style:right={position === "absolute" ? "0" : null}
    style:bottom={position === "absolute" ? "0" : null}
    style:left={position === "absolute" ? "0" : null}
    style:pointer-events={pointerEvents === false ? "none" : null}
    bind:clientWidth={containerWidth}
    bind:clientHeight={containerHeight}
  >
    <slot
      {element}
      width={$width_d}
      height={$height_d}
      aspectRatio={$aspectRatio_d}
      containerWidth={$_containerWidth}
      containerHeight={$_containerHeight}
    />
  </div>
{/if}

<style>
  .chart-container,
  .chart-container :global(*) {
    box-sizing: border-box;
  }
  .chart-container {
    width: 100%;
    height: 100%;
  }
</style>
