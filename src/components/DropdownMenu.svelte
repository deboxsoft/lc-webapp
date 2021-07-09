<script>
  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";
  import { getContextDropdown } from "./Dropdown.svelte";
  const context = getContextDropdown();
  export let className = $$props.class || "";
  export let dark = false;
  export let end = false;
  export let right = true;
  const popperPlacement = (direction, end) => {
    let prefix = direction;
    if (direction === "up") prefix = "top";
    else if (direction === "down") prefix = "bottom";
    let suffix = end ? "end" : "start";
    return `${prefix}-${suffix}`;
  };
  $: popperContent = $context.popperContent;
  $: popperOptions = {
    modifiers: [
      { name: "flip" },
      {
        name: "offset",
        options: {
          offset: [0, 0]
        }
      }
    ],
    placement: popperPlacement($context.direction, end || right)
  };
  $: classes = clsx(className, "dropdown-menu", {
    "dropdown-menu-dark": dark,
    "dropdown-menu-end": end,
    "dropdown-menu-right": right,
    show: $context.isOpen
  });
</script>

<div {...$$restProps} class={classes} use:popperContent={popperOptions}>
  <slot />
</div>
