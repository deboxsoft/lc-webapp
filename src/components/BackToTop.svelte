<script>
  export let showOnPx = 450;
  let hidden = true;

  function goTop() {
    document.body.scrollIntoView();
  }

  function scrollContainer() {
    return document.documentElement || document.body;
  }

  function handleOnScroll() {
    if (!scrollContainer()) {
      return;
    }
    hidden = scrollContainer().scrollTop <= showOnPx;
  }
</script>

<style lang="scss">
  .btn-to-top {
    position: absolute;
    bottom: 1.25rem;
    right: 1.25rem;
    align-self: flex-end;
    opacity: 0;
    visibility: hidden;
    z-index: 999;
    transition: all .15s ease-in-out;
    &.visible {
      visibility: visible;
      opacity: 1;
    }
  }
</style>

<svelte:window on:scroll={handleOnScroll} />

<div class="btn-to-top" on:click={goTop} class:visible={!hidden}>
  <button class="btn btn-dark btn-icon rounded-pill"><i class="icon-arrow-up8" /> </button>
</div>
