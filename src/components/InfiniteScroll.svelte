<script>
  import { onDestroy, createEventDispatcher } from "svelte";
  import Loader from "./loader/Loader.svelte";

  export let threshold = 0;
  export let horizontal = false;
  export let elementScroll;
  export let hasMore = true;
  export let loading = false;

  const dispatch = createEventDispatcher();
  let isLoadMore = false;
  let component;

  $: {
    if (component || elementScroll) {
      const element = elementScroll ? elementScroll : component.parentNode;

      element.addEventListener("scroll", onScroll);
      element.addEventListener("resize", onScroll);
    }
  }

  const onScroll = e => {
    const scrollingElement = e.target.scrollingElement || e.target;

    const offset = horizontal
      ? scrollingElement.scrollWidth - scrollingElement.clientWidth - scrollingElement.scrollLeft
      : scrollingElement.scrollHeight - scrollingElement.clientHeight - scrollingElement.scrollTop;
    if (offset <= threshold) {
      if (!isLoadMore && hasMore) {
        dispatch("loadMore");
      }
      isLoadMore = true;
    } else {
      isLoadMore = false;
    }
  };

  onDestroy(() => {
    if (component || elementScroll) {
      const element = elementScroll ? elementScroll : component.parentNode;

      element.removeEventListener("scroll", null);
      element.removeEventListener("resize", null);
    }
  });
</script>

<slot>
  {#if loading}
    <Loader />
  {/if}
</slot>
<div bind:this={component} style="width:0" />