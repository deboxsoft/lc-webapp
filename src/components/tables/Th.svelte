<script>
  import { onMount, onDestroy } from "svelte";

  export let label;
  export let resizeDisable = false;
  export let className = $$props.class || "";

  /**
   * @type {HTMLTableHeaderCellElement}
   */
  let colRef;
  /**
   * @type {HTMLDivElement}
   */
  let resizerRef;
  let x = 0, w = 0;

  onMount(() => {
    if (!resizeDisable) {
      resizerRef.addEventListener("mousedown", mouseDownHandler);
      resizerRef.addEventListener("touch", mouseDownHandler);
    }
  })

  onDestroy(() => {
    if (!resizeDisable) {
      resizerRef.removeEventListener("mousedown", mouseDownHandler);
      resizerRef.removeEventListener("touchstart", mouseDownHandler);
    }
  })

  /**
   *
   * @param e {MouseEvent}
   */
  function mouseDownHandler(e) {
    // current mouse position
    x = e.clientX;

    // calculate current width of column
    const styles = window.getComputedStyle(colRef);
    w = parseInt(styles.width, 10);

    // listener
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  }

  /**
   *
   * @param e {MouseEvent}
   */
  function mouseMoveHandler(e) {
    // determine how far the mouse has been move
    const dx = e.clientX - x;

    // update width column
    colRef.style.width = `${w + dx}px`;
  }

  /**
   * event release mouse
   */
  function mouseUpHandler() {
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
  }
</script>

<th class={className} bind:this={colRef}>
  {label}
  {#if !resizeDisable}
    <div class="resizer" bind:this={resizerRef} />
  {/if}
</th>

<style>
  th {
    position: relative;
  }
  .resizer {
    position: absolute;
    top: 0;
    right: 0;
    width: 5px;
    cursor: col-resize;
    user-select: none;
  }

  .resizer,
  .resizing {
    border-right: 2px solid black;
  }
</style>
