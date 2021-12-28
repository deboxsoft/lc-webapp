<script>
  import { generateId } from "@deboxsoft/module-client";
  import { getContext, onDestroy } from "svelte";
  import { clsx } from "@deboxsoft/module-client";

  let itemId = `dbx-${generateId({ size: 5 })}`;
  // props
  export let id = `nav-item-${itemId}`;
  export let title = "Title";
  export let expanded = false;
  // export let disabled: boolean = false;
  export let href = "/#";
  export let ref = undefined;
  export let toggleClass = undefined;
  export let target = undefined;
  export let hasChildren = false;

  // state
  let { class: className } = $$props;
  let classes;
  let unsubscribe;

  onDestroy(() => {
    if (ctx) ctx.remove({ id: itemId });
    if (unsubscribe) unsubscribe();
  });

  const ctx = getContext("Accordion");
  // handler
  function handleClick(e) {
    href === "/#" && e.preventDefault();
    if (ctx) {
      ctx.toggle({ id, expanded: !expanded });
      if (expanded && ref && ref.getBoundingClientRect().top < 0) {
        ref.scrollIntoView();
      }
    }
  }

  // reactive
  $: toggleClass = clsx("nav-link", toggleClass);
  $: {
    if (ctx) {
      ctx.add({ id, expanded });
      unsubscribe = ctx.items.subscribe((value) => {
        expanded = value[id];
      });
    }
    classes = clsx(
      className,
      "nav-item",
      expanded && "nav-item-open",
      $$slots["menu"] && hasChildren && "nav-item-submenu"
    );
  }
</script>

<li class={classes}>
  <a
    {...$$restProps}
    {href}
    class={toggleClass}
    bind:this={ref}
    on:click={handleClick}
    on:click
    on:mouseover
    on:mouseenter
    on:mouseout
    on:focus
    on:blur
    on:keydown
    {target}
  >
    <slot>{title}</slot>
  </a>
  {#if hasChildren}
    <slot name="menu" {expanded} />
  {/if}
</li>
