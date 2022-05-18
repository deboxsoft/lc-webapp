import { getContext, setContext } from "svelte";
import { derived, Readable, Writable, writable } from "svelte/store";
import type { ViewBox } from "./types";
import makeAccessor from "./utils/makeAccessor";
import filterObject from "./utils/filterObject";
import calcExtents from "./lib/calcExtents";
import calcDomain from "./helpers/calcDomain";
import createScale from "./helpers/createScale";
import createGetter from "./helpers/createGetter";
import getRange from "./helpers/getRange";
import defaultScales from "./settings/defaultScales";
import defaultReverses from "./settings/defaultReverses";

type FieldAccessor = (() => any) | string | number | any[];
type FieldDomain = [min?: number, max?: number] | Array<string | number>;
type FieldScale = (() => any) & { copy: () => any };
type FieldRange = (() => any) | [min: number, max: number] | Array<string | number>;
export interface ChartProperties {
  /** @desc If `true`, set all scale ranges to `[0, 100]`. Ranges reversed via `xReverse`, `yReverse`, `zReverse` or `rReverse` props will continue to be reversed as usual. */
  percentRange: boolean;

  /** @desc Override the automated width. */
  containerWidth: number;

  /** @desc Override the automated height. */
  containerHeight: number;

  /** @desc x The x accessor. The key in each row of data that corresponds to the x-field. This can be a string, an accessor function, a number or an array of any combination of those types. This property gets converted to a function when you access it through the context. */
  x: FieldAccessor;
  /** @desc y The x accessor. The key in each row of data that corresponds to the y-field. This can be a string, an accessor function, a number or an array of any combination of those types. This property gets converted to a function when you access it through the context. */
  y: FieldAccessor;

  /** @desc y The x accessor. The key in each row of data that corresponds to the z-field. This can be a string, an accessor function, a number or an array of any combination of those types. This property gets converted to a function when you access it through the context. */
  z: FieldAccessor;

  /** @desc z The x accessor. The key in each row of data that corresponds to the r-field. This can be a string, an accessor function, a number or an array of any combination of those types. This property gets converted to a function when you access it through the context. */
  r: FieldAccessor;

  /** @desc [xDomain] Set a min or max. For linear scales, if you want to inherit the value from the data's extent, set that value to `null`. This value can also be an array because sometimes your scales are [piecewise](https://github.com/d3/d3-scale#continuous_domain) or are a list of discrete values such as in [ordinal scales](https://github.com/d3/d3-scale#ordinal-scales), useful for color series.*/
  xDomain: FieldDomain;

  /** @desc [yDomain] Set a min or max. For linear scales, if you want to inherit the value from the data's extent, set that value to `null`. This value can also be an array because sometimes your scales are [piecewise](https://github.com/d3/d3-scale#continuous_domain) or are a list of discrete values such as in [ordinal scales](https://github.com/d3/d3-scale#ordinal-scales), useful for color series.*/
  yDomain: FieldDomain;

  /** @desc [zDomain] Set a min or max. For linear scales, if you want to inherit the value from the data's extent, set that value to `null`. This value can also be an array because sometimes your scales are [piecewise](https://github.com/d3/d3-scale#continuous_domain) or are a list of discrete values such as in [ordinal scales](https://github.com/d3/d3-scale#ordinal-scales), useful for color series.*/
  zDomain: FieldDomain;

  /** @desc [rDomain] Set a min or max. For linear scales, if you want to inherit the value from the data's extent, set that value to `null`. This value can also be an array because sometimes your scales are [piecewise](https://github.com/d3/d3-scale#continuous_domain) or are a list of discrete values such as in [ordinal scales](https://github.com/d3/d3-scale#ordinal-scales), useful for color series.*/
  rDomain: FieldDomain;

  /** @desc [xNice=false] Applies D3's [scale.nice()](https://github.com/d3/d3-scale#continuous_nice) to the x domain. */
  xNice: boolean;

  /** @desc [yNice=false] Applies D3's [scale.nice()](https://github.com/d3/d3-scale#continuous_nice) to the y domain. */
  yNice: boolean;

  /** @desc [zNice=false] Applies D3's [scale.nice()](https://github.com/d3/d3-scale#continuous_nice) to the z domain. */
  zNice: boolean;

  /** @desc [rNice=false] Applies D3's [scale.nice()](https://github.com/d3/d3-scale#continuous_nice) to the r domain. */
  rNice: boolean;

  /** @desc [xReverse=false] Reverse the default x range. By default this is `false` and the range is `[0, width]`. Ignored if you set the xRange prop. */
  xReverse: boolean;

  /** @desc [yReverse=false] Reverse the default y range. By default this is `false` and the range is `[0, width]`. Ignored if you set the yRange prop. */
  yReverse: boolean;

  /** @desc [zReverse=false] Reverse the default z range. By default this is `false` and the range is `[0, width]`. Ignored if you set the zRange prop. */
  zReverse: boolean;

  /** @desc [rReverse=false] Reverse the default r range. By default this is `false` and the range is `[0, width]`. Ignored if you set the rRange prop. */
  rReverse: boolean;

  /** @desv [xPadding] Assign a pixel value to add to the min or max of the scale. This will increase the scales domain by the scale unit equivalent of the provided pixels. */
  xPadding: [leftPixels: number, rightPixels: number];

  /** @desv [yPadding] Assign a pixel value to add to the min or max of the scale. This will increase the scales domain by the scale unit equivalent of the provided pixels. */
  yPadding: [leftPixels: number, rightPixels: number];

  /** @desv [zPadding] Assign a pixel value to add to the min or max of the scale. This will increase the scales domain by the scale unit equivalent of the provided pixels. */
  zPadding: [leftPixels: number, rightPixels: number];

  /** @desv [rPadding] Assign a pixel value to add to the min or max of the scale. This will increase the scales domain by the scale unit equivalent of the provided pixels. */
  rPadding: [leftPixels: number, rightPixels: number];

  /** @desc [xScale=d3.scaleLinear] The D3 scale that should be used for the x-dimension. Pass in an instantiated D3 scale if you want to override the default or you want to extra options. */
  xScale: FieldScale;

  /** @desc [yScale=d3.scaleLinear] The D3 scale that should be used for the y-dimension. Pass in an instantiated D3 scale if you want to override the default or you want to extra options. */
  yScale: FieldScale;

  /** @desc [zScale=d3.scaleLinear] The D3 scale that should be used for the z-dimension. Pass in an instantiated D3 scale if you want to override the default or you want to extra options. */
  zScale: FieldScale;

  /** @desc [rScale=d3.scaleLinear] The D3 scale that should be used for the r-dimension. Pass in an instantiated D3 scale if you want to override the default or you want to extra options. */
  rScale: FieldScale;

  /** @desc [xRange] Override the default x range of `[0, width]` by setting an array or function with argument `({ width, height})` that returns an array. Setting this prop overrides `xReverse`. This can also be a list of numbers or strings for scales with discrete ranges like [scaleThreshhold](https://github.com/d3/d3-scale#threshold-scales) or [scaleQuantize](https://github.com/d3/d3-scale#quantize-scales). */
  xRange: FieldRange;

  /** @desc [yRange] Override the default x range of `[0, width]` by setting an array or function with argument `({ width, height})` that returns an array. Setting this prop overrides `yReverse`. This can also be a list of numbers or strings for scales with discrete ranges like [scaleThreshhold](https://github.com/d3/d3-scale#threshold-scales) or [scaleQuantize](https://github.com/d3/d3-scale#quantize-scales). */
  yRange: FieldRange;

  /** @desc [zRange] Override the default x range of `[0, width]` by setting an array or function with argument `({ width, height})` that returns an array. Setting this prop overrides `zReverse`. This can also be a list of numbers or strings for scales with discrete ranges like [scaleThreshhold](https://github.com/d3/d3-scale#threshold-scales) or [scaleQuantize](https://github.com/d3/d3-scale#quantize-scales). */
  zRange: FieldRange;

  /** @desc [rRange] Override the default x range of `[0, width]` by setting an array or function with argument `({ width, height})` that returns an array. Setting this prop overrides `rReverse`. This can also be a list of numbers or strings for scales with discrete ranges like [scaleThreshhold](https://github.com/d3/d3-scale#threshold-scales) or [scaleQuantize](https://github.com/d3/d3-scale#quantize-scales). */
  rRange: FieldRange;

  padding: { top?: number; right?: number; bottom?: number; left?: number };

  extents: {
    x?: [min: number, max: number];
    y?: [min: number, max: number];
    r?: [min: number, max: number];
    z?: [min: number, max: number];
  };

  /** @desc  If `data` is not a flat array of objects and you want to use any of the scales, set a flat version of the data via the `flatData` prop.*/
  data: Array<any>;

  /** @desc flat version data */
  flatData: Array<any>;
}

export type ChartOptions = Partial<ChartProperties>;

export interface ChartContext {
  setMounted: (mounted: boolean) => void;
  setPercentRange: (percentRange: ChartProperties["percentRange"]) => void;
  setContainerWidth: (containerWidth: ChartProperties["containerWidth"]) => void;
  setContainerHeight: (containerHeight: ChartProperties["containerHeight"]) => void;
  setExtents: (extents: ChartProperties["extents"]) => void;
  setData: (data: ChartProperties["data"]) => void;
  setFlatData: (data: ChartProperties["flatData"]) => void;
  setPadding: (padding: ChartProperties["padding"]) => void;
  setX: (x: ChartProperties["x"]) => void;
  setY: (y: ChartProperties["y"]) => void;
  setZ: (z: ChartProperties["z"]) => void;
  setR: (r: ChartProperties["r"]) => void;
  setXDomain: (xDomain: ChartProperties["xDomain"]) => void;
  setYDomain: (yDomain: ChartProperties["yDomain"]) => void;
  setZDomain: (zDomain: ChartProperties["zDomain"]) => void;
  setRDomain: (rDomain: ChartProperties["rDomain"]) => void;
  setXNice: (xNice: ChartProperties["xNice"]) => void;
  setYNice: (yNice: ChartProperties["yNice"]) => void;
  setZNice: (zNice: ChartProperties["zNice"]) => void;
  setRNice: (rNice: ChartProperties["rNice"]) => void;
  setXReverse: (xReverse: ChartProperties["xReverse"]) => void;
  setYReverse: (yReverse: ChartProperties["yReverse"]) => void;
  setZReverse: (zReverse: ChartProperties["zReverse"]) => void;
  setRReverse: (rReverse: ChartProperties["rReverse"]) => void;
  setXPadding: (xPadding: ChartProperties["xPadding"]) => void;
  setYPadding: (yPadding: ChartProperties["yPadding"]) => void;
  setZPadding: (zPadding: ChartProperties["zPadding"]) => void;
  setRPadding: (rPadding: ChartProperties["rPadding"]) => void;
  setXRange: (xRange: ChartProperties["xRange"]) => void;
  setYRange: (yRange: ChartProperties["yRange"]) => void;
  setZRange: (zRange: ChartProperties["zRange"]) => void;
  setRRange: (rRange: ChartProperties["rRange"]) => void;
  setXScale: (xScale: ChartProperties["xScale"]) => void;
  setYScale: (yScale: ChartProperties["yScale"]) => void;
  setZScale: (zScale: ChartProperties["zScale"]) => void;
  setRScale: (rScale: ChartProperties["rScale"]) => void;
  percentRange: Writable<ChartProperties["percentRange"]>;
  containerWidth: Writable<ChartProperties["containerWidth"]>;
  containerHeight: Writable<ChartProperties["containerHeight"]>;
  width: Readable<ChartProperties["containerWidth"]>;
  height: Readable<ChartProperties["containerHeight"]>;
  extents: Readable<ChartProperties["extents"]>;
  data: Writable<ChartProperties["data"]>;
  flatData: Writable<ChartProperties["flatData"]>;
  padding: Readable<ChartProperties["padding"]>;
  x: Writable<ChartProperties["x"]>;
  y: Writable<ChartProperties["y"]>;
  z: Writable<ChartProperties["z"]>;
  r: Writable<ChartProperties["r"]>;
  xDomain: Readable<ChartProperties["xDomain"]>;
  yDomain: Readable<ChartProperties["yDomain"]>;
  zDomain: Readable<ChartProperties["zDomain"]>;
  rDomain: Readable<ChartProperties["rDomain"]>;
  xNice: Writable<ChartProperties["xNice"]>;
  yNice: Writable<ChartProperties["yNice"]>;
  zNice: Writable<ChartProperties["zNice"]>;
  rNice: Writable<ChartProperties["rNice"]>;
  xReverse: Writable<ChartProperties["xReverse"]>;
  yReverse: Writable<ChartProperties["yReverse"]>;
  zReverse: Writable<ChartProperties["zReverse"]>;
  rReverse: Writable<ChartProperties["rReverse"]>;
  xPadding: Writable<ChartProperties["xPadding"]>;
  yPadding: Writable<ChartProperties["yPadding"]>;
  zPadding: Writable<ChartProperties["zPadding"]>;
  rPadding: Writable<ChartProperties["rPadding"]>;
  xRange: Readable<ChartProperties["xRange"]>;
  yRange: Readable<ChartProperties["yRange"]>;
  zRange: Readable<ChartProperties["zRange"]>;
  rRange: Readable<ChartProperties["rRange"]>;
  xScale: Readable<ChartProperties["xScale"]>;
  yScale: Readable<ChartProperties["yScale"]>;
  zScale: Readable<ChartProperties["zScale"]>;
  rScale: Readable<ChartProperties["rScale"]>;
  xGet: Readable<(d: any) => any>;
  yGet: Readable<(d: any) => any>;
  zGet: Readable<(d: any) => any>;
  rGet: Readable<(d: any) => any>;
  aspectRatio: Readable<number>;
  config: Readable<Partial<ChartProperties>>;
}

const KEY = Symbol("chart-context");
export const createContextChart = (config: Partial<ChartProperties> = {}) => {
  let isMounted = false;
  const configStore = writable(config);
  const percentRangeStore = writable(config.percentRange || false);
  const containerWidthStore = writable(config.containerWidth || 100);
  const containerHeightStore = writable(config.containerHeight || 100);
  const extentsStore = writable(filterObject(config.extents || {}));
  const dataStore = writable(config.data || []);
  const flatDataStore = writable(config.flatData || config.data || []);
  const paddingStore = writable(config.padding || {});
  const xStore = writable(makeAccessor(config.x));
  const yStore = writable(makeAccessor(config.y));
  const zStore = writable(makeAccessor(config.z));
  const rStore = writable(makeAccessor(config.r));
  const xDomainStore = writable(config.xDomain);
  const yDomainStore = writable(config.yDomain);
  const zDomainStore = writable(config.zDomain);
  const rDomainStore = writable(config.rDomain);
  const xNiceStore = writable(config.xNice || false);
  const yNiceStore = writable(config.yNice || false);
  const zNiceStore = writable(config.zNice || false);
  const rNiceStore = writable(config.rNice || false);
  const xReverseStore = writable(config.xReverse || defaultReverses.x);
  const yReverseStore = writable(config.yReverse || defaultReverses.y);
  const zReverseStore = writable(config.zReverse || defaultReverses.z);
  const rReverseStore = writable(config.rReverse || defaultReverses.r);
  const xPaddingStore = writable(config.xPadding);
  const yPaddingStore = writable(config.yPadding);
  const zPaddingStore = writable(config.zPadding);
  const rPaddingStore = writable(config.rPadding);
  const xRangeStore = writable(config.xRange);
  const yRangeStore = writable(config.yRange);
  const zRangeStore = writable(config.zRange);
  const rRangeStore = writable(config.rRange);
  const xScaleStore = writable(config.xScale || defaultScales.x);
  const yScaleStore = writable(config.yScale || defaultScales.y);
  const zScaleStore = writable(config.zScale || defaultScales.z);
  const rScaleStore = writable(config.rScale || defaultScales.r);
  const activeGetters = derived<[typeof xStore, typeof yStore, typeof rStore, typeof zStore], Record<string, any>>(
    [xStore, yStore, zStore, rStore],
    ([$x, $y, $z, $r]) => {
      const obj: any = {};
      if ($x) {
        obj.x = $x;
      }
      if ($y) {
        obj.y = $y;
      }
      if ($z) {
        obj.z = $z;
      }
      if ($r) {
        obj.r = $r;
      }
      return obj;
    }
  );

  const padding = derived([paddingStore, containerWidthStore, containerHeightStore], ([$padding]) => {
    const defaultPadding: ChartProperties["padding"] = { top: 0, right: 0, bottom: 0, left: 0 };
    return Object.assign(defaultPadding, $padding);
  });

  const box = derived<[typeof containerWidthStore, typeof containerHeightStore, typeof padding], ViewBox>(
    [containerWidthStore, containerHeightStore, padding],
    ([$containerWidth, $containerHeight, $padding]) => {
      const b: ViewBox = {} as ViewBox;
      b.top = $padding.top;
      b.right = $containerWidth - $padding.right;
      b.bottom = $containerHeight - $padding.bottom;
      b.left = $padding.left;
      b.width = b.right - b.left;
      b.height = b.bottom - b.top;
      if (b.width <= 0 && isMounted) {
        console.warn(
          "Target div has zero or negative width. Did you forget to set an explicit width in CSS on the container?"
        );
      }
      if (b.height <= 0 && isMounted) {
        console.warn(
          "Target div has zero or negative height. Did you forget to set an explicit height in CSS on the container?"
        );
      }
      return b;
    }
  );

  const width = derived<[typeof box], number>([box], ([$box]) => {
    return $box.width;
  });

  const height = derived<[typeof box], number>([box], ([$box]) => {
    return $box.height;
  });

  const _extends = derived<[typeof flatDataStore, typeof activeGetters, typeof extentsStore], Record<string, any>>(
    [flatDataStore, activeGetters, extentsStore],
    ([$flatDataStore, $activeGetters, $extends]) => {
      const getters = filterObject($activeGetters, $extends);
      if (Object.keys(getters).length > 0) {
        return { ...calcExtents($flatDataStore, getters), ...$extends };
      }
      return {};
    }
  );

  const xDomain = derived<[typeof _extends, typeof xDomainStore], FieldDomain>(
    [_extends, xDomainStore],
    calcDomain("x")
  );
  const yDomain = derived<[typeof _extends, typeof yDomainStore], FieldDomain>(
    [_extends, yDomainStore],
    calcDomain("y")
  );
  const zDomain = derived<[typeof _extends, typeof zDomainStore], FieldDomain>(
    [_extends, zDomainStore],
    calcDomain("z")
  );
  const rDomain = derived<[typeof _extends, typeof rDomainStore], FieldDomain>(
    [_extends, rDomainStore],
    calcDomain("r")
  );
  const xScale = derived<
    [
      typeof xScaleStore,
      typeof _extends,
      typeof xDomain,
      typeof xPaddingStore,
      typeof xNiceStore,
      typeof xReverseStore,
      typeof width,
      typeof height,
      typeof xRangeStore,
      typeof percentRangeStore
    ],
    any
  >(
    [
      xScaleStore,
      _extends,
      xDomain,
      xPaddingStore,
      xNiceStore,
      xReverseStore,
      width,
      height,
      xRangeStore,
      percentRangeStore
    ],
    createScale("x")
  );

  const yScale = derived<
    [
      typeof yScaleStore,
      typeof _extends,
      typeof yDomain,
      typeof yPaddingStore,
      typeof yNiceStore,
      typeof yReverseStore,
      typeof width,
      typeof height,
      typeof yRangeStore,
      typeof percentRangeStore
    ],
    any
  >(
    [
      yScaleStore,
      _extends,
      yDomain,
      yPaddingStore,
      yNiceStore,
      yReverseStore,
      width,
      height,
      yRangeStore,
      percentRangeStore
    ],
    createScale("y")
  );

  const zScale = derived<
    [
      typeof zScaleStore,
      typeof _extends,
      typeof zDomain,
      typeof zPaddingStore,
      typeof zNiceStore,
      typeof zReverseStore,
      typeof width,
      typeof height,
      typeof zRangeStore,
      typeof percentRangeStore
    ],
    any
  >(
    [
      zScaleStore,
      _extends,
      zDomain,
      zPaddingStore,
      zNiceStore,
      zReverseStore,
      width,
      height,
      zRangeStore,
      percentRangeStore
    ],
    createScale("z")
  );

  const rScale = derived<
    [
      typeof rScaleStore,
      typeof _extends,
      typeof rDomain,
      typeof rPaddingStore,
      typeof rNiceStore,
      typeof rReverseStore,
      typeof width,
      typeof height,
      typeof rRangeStore,
      typeof percentRangeStore
    ],
    any
  >(
    [
      rScaleStore,
      _extends,
      rDomain,
      rPaddingStore,
      rNiceStore,
      rReverseStore,
      width,
      height,
      rRangeStore,
      percentRangeStore
    ],
    createScale("r")
  );
  const xGet = derived([xStore, xScale], createGetter);
  const yGet = derived([yStore, yScale], createGetter);
  const zGet = derived([zStore, zScale], createGetter);
  const rGet = derived([rStore, rScale], createGetter);

  const xRange = derived([xScale], getRange);
  const yRange = derived([yScale], getRange);
  const zRange = derived([zScale], getRange);
  const rRange = derived([rScale], getRange);
  const aspectRatio = derived([width, height], ([$width, $height]) => {
    return $width / $height;
  });
  const context: ChartContext = {
    config: configStore,
    setMounted: (mounted) => {
      isMounted = mounted;
    },
    setPercentRange: (percentRange) => percentRangeStore.set(percentRange),
    setContainerWidth: (containerWidth) => containerWidthStore.set(containerWidth),
    setContainerHeight: (containerHeight) => containerHeightStore.set(containerHeight),
    setExtents: (extents) => extentsStore.set(filterObject(extents)),
    setData: (data) => dataStore.set(data),
    setFlatData: (data) => flatDataStore.set(data),
    setPadding: (padding) => paddingStore.set(padding),
    setX: (x) => xStore.set(x),
    setY: (y) => yStore.set(y),
    setZ: (z) => zStore.set(z),
    setR: (r) => rStore.set(r),
    setXDomain: (xDomain) => xDomainStore.set(xDomain),
    setYDomain: (yDomain) => yDomainStore.set(yDomain),
    setZDomain: (zDomain) => zDomainStore.set(zDomain),
    setRDomain: (rDomain) => rDomainStore.set(rDomain),
    setXNice: (xNice) => xNiceStore.set(xNice),
    setYNice: (yNice) => yNiceStore.set(yNice),
    setZNice: (zNice) => zNiceStore.set(zNice),
    setRNice: (rNice) => rNiceStore.set(rNice),
    setXReverse: (xReverse) => xReverseStore.set(xReverse),
    setYReverse: (yReverse) => yReverseStore.set(yReverse),
    setZReverse: (zReverse) => zReverseStore.set(zReverse),
    setRReverse: (rReverse) => rReverseStore.set(rReverse),
    setXPadding: (xPadding) => xPaddingStore.set(xPadding),
    setYPadding: (yPadding) => yPaddingStore.set(yPadding),
    setZPadding: (zPadding) => zPaddingStore.set(zPadding),
    setRPadding: (rPadding) => rPaddingStore.set(rPadding),
    setXRange: (xRange) => xRangeStore.set(xRange),
    setYRange: (yRange) => yRangeStore.set(yRange),
    setZRange: (zRange) => zRangeStore.set(zRange),
    setRRange: (rRange) => rRangeStore.set(rRange),
    setXScale: (xScale) => xScaleStore.set(xScale),
    setYScale: (yScale) => yScaleStore.set(yScale),
    setZScale: (zScale) => zScaleStore.set(zScale),
    setRScale: (rScale) => rScaleStore.set(rScale),
    percentRange: percentRangeStore,
    containerWidth: containerWidthStore,
    containerHeight: containerHeightStore,
    width,
    height,
    extents: _extends,
    data: dataStore,
    flatData: flatDataStore,
    padding,
    x: xStore,
    y: yStore,
    z: zStore,
    r: rStore,
    xDomain,
    yDomain,
    zDomain,
    rDomain,
    xNice: xNiceStore,
    yNice: yNiceStore,
    zNice: zNiceStore,
    rNice: rNiceStore,
    xReverse: xReverseStore,
    yReverse: yReverseStore,
    zReverse: zReverseStore,
    rReverse: rReverseStore,
    xPadding: xPaddingStore,
    yPadding: yPaddingStore,
    zPadding: zPaddingStore,
    rPadding: rPaddingStore,
    xRange,
    yRange,
    zRange,
    rRange,
    xScale,
    yScale,
    zScale,
    rScale,
    xGet,
    yGet,
    rGet,
    zGet,
    aspectRatio
  };
  setContext(KEY, context);
  return context;
};

export const getContextChart = () => getContext<ChartContext>(KEY);
