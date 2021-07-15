<script>
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import { clsx } from "@deboxsoft/module-client";

  // props
  export let isLight= false;
  export let expand = undefined;
  export let alignSelf = undefined;

  // state
  let isFullscreen = writable(false);
  let { class: className } = $$props;
  let classes;

  // handler
  setContext("sidebar", {
    isFullscreen
  });

  // reactive
  $: classes = clsx(
    className,
    "sidebar sidebar-main",
    isLight && "sidebar-light",
    expand && `sidebar-expand-${expand}`,
    alignSelf && `align-self-${alignSelf}`,
    $isFullscreen && "sidebar-fullscreen"
  );
</script>

<div {...$$restProps} class={classes}>
  <!-- Main navigation -->
  <slot />
  <div class="sidebar-content">
    <slot name="sidebar-content" />
  </div>
</div>
