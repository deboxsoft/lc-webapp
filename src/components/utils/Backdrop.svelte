<script>
  import TrapScreenReader from "./TrapScreenReader.svelte";
  import TrapFocus from "./TrapFocus.svelte";
  import LockScroll from "./LockScroll.svelte";
  // Props

  /**
   *
   * @type {undefined | Function}
   */
  export let onClose = undefined;
  export let initialFocusElement = undefined;
  export let returnFocusElement = undefined;
  export let ariaModalLegacy = false;
  const clickHandler = () => {
    //onClose && onClose();
  }
  const keydownHandler = (event) => {
    if (event.key === "Escape") {
      onClose && onClose();
    }
  }
</script>

<style>
  div {
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: auto;
  }
</style>

<svelte:window on:keydown={keydownHandler} />

<TrapScreenReader enabled={ariaModalLegacy}>
  <TrapFocus {initialFocusElement} {returnFocusElement}>
    <LockScroll>
      <div
        {...$$restProps}
        data-svelte-dialog-overlay
        on:click|self|stopPropagation={clickHandler}
      >
        <slot />
      </div>
    </LockScroll>
  </TrapFocus>
</TrapScreenReader>
