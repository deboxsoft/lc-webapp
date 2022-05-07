<script>
  /** @type {Object} evt - A svelte event created via [`dispatch`](https://svelte.dev/docs#createEventDispatcher) with event information under `evt.detail.e`. */
  export let evt = {};
  export let offsetX = 0;
  export let offsetY = 0;
  const width = 60,
    left = 200,
    height = 15;
</script>

{#if evt?.detail}
  <div class="d3-tip" style="left: {evt.detail.x}px;top: {evt.detail.y}px">
    <slot detail={evt?.detail} />
  </div>
{/if}

<style>
  .d3-tip {
    position: absolute;
    pointer-events: none;
    display: block;
    box-sizing: border-box;
  }
</style>
