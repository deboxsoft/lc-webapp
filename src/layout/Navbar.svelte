<script>
  import { clsx } from "@deboxsoft/module-client";

  // props
  export let expand = undefined;
  export let isDark = false;
  export let color = undefined;

  // state
  let { class: className } = $$props;
  let classes;

  // handler

  // reactive
  $: classes = clsx(
    className,
    "navbar",
    isDark && "navbar-dark",
    color && `navbar-${color}`,
    expand && `navbar-expand-${expand}`
  );
</script>

<div {...$$restProps} class={classes}>
  <slot />
</div>
