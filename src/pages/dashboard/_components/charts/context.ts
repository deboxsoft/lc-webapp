import { getContext, setContext } from "svelte";
const KEY = Symbol("chart-context");

export type Value = string | Function;
export interface ChartContext {}
export function createContextChart() {
  const context = {};
  setContext(KEY, context);
}
export function getContextChart() {
  return getContext(KEY);
}
