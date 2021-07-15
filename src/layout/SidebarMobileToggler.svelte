<script>
  import { getContext } from "svelte";
  import { clsx } from "@deboxsoft/module-client";

  // props
  export let onToggleShowMobileSidebar = undefined;

  // state
  let { class: className } = $$props;
  let classes;
  const { isFullscreen } = getContext("sidebar");

  // handler
  function toggleShowMobileHandler() {
    if (onToggleShowMobileSidebar) {
      console.log("show mobile toggler");
      onToggleShowMobileSidebar();
    }
  }

  // reactive
  $: classes = clsx(className, "sidebar-mobile-toggler text-center", "sidebar-fullscreen");
</script>

<div {...$$restProps} class={classes}>
  <a href="/#" class="sidebar-mobile-main-toggle" target="_self" on:click|preventDefault={toggleShowMobileHandler}>
    <i class="icon-arrow-left8" />
  </a>
  <span class="font-weight-semibold">Main sidebar</span>
  <a
    href="/#"
    class="sidebar-mobile-expand"
    target="_self"
    on:click|preventDefault={() => {
      $isFullscreen = !$isFullscreen;
    }}>
    <i class="icon-screen-full" />
    <i class="icon-screen-normal" />
  </a>
</div>
