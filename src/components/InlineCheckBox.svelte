<script>
  /** Specify whether the checkbox is checked */
  export let checked = false;
  /** Specify whether the checkbox is indeterminate */
  export let indeterminate = false;
  /**
   * Specify the title attribute for the label element
   * @type {string}
   */
  export let title = undefined;
  /** Set an id for the input label */
  export let id = `ccs-${Math.random().toString(36)}`;
  /** Obtain a reference to the input HTML element */
  export let ref = null;
  export let labelStyle = "";
</script>

<input
  bind:this={ref}
  type="checkbox"
  class="checkbox"
  checked={indeterminate ? false : checked}
  {indeterminate}
  {id}
  {...$$restProps}
  aria-label={undefined}
  aria-checked={indeterminate ? "mixed" : checked}
  on:change
/>
<label for={id} {title} aria-label={$$props["aria-label"]} class="label" style={labelStyle} />

<style>
  .checkbox {
    margin: -1px;
    overflow: hidden;
    white-space: nowrap;
    border: 0;
    visibility: inherit;
    clip: rect(0, 0, 0, 0);
  }
  .label {
    line-height: 1.29;
    user-select: none;
    min-height: 1.5rem;
    display: flex;
    position: relative;
    cursor: pointer;
    width: 1px;
  }
</style>
