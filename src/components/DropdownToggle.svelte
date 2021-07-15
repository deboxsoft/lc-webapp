<script>
  import { getContextDropdown } from "./Dropdown.svelte";
  import { clsx } from "@deboxsoft/module-client";

  const context = getContextDropdown();
  export let className = $$props.class || "";
  export let ariaLabel = "Toggle Dropdown";
  export let active = false;
  export let block = false;
  export let caret = false;
  export let color = "secondary";
  export let disabled = false;
  export let inner = undefined;
  export let nav = false;
  export let outline = false;
  export let size = "";
  export let split = false;
  export let tag = undefined;

  $: popperRef = $context.popperRef;
  $: classes = clsx(className, {
    "dropdown-toggle": caret || split,
    "dropdown-toggle-split": split,
    "nav-link": nav
  });
  export function toggle(e) {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (nav) {
      e.preventDefault();
    }
    $context.toggle(e);
  }
  $: btnClasses = clsx(
    classes,
    "btn",
    `btn${outline ? "-outline" : ""}-${color}`,
    size ? `btn-${size}` : false,
    block ? "d-block w-100" : false,
    { active }
  );
</script>

{#if nav}
  <a
    use:popperRef
    {...$$restProps}
    bind:this={inner}
    on:click
    on:click={toggle}
    href="#nav"
    aria-expanded={$context.isOpen}
    class={classes}
  >
    <slot>
      <span class="visually-hidden">{ariaLabel}</span>
    </slot>
  </a>
{:else if tag === "button"}
  <button
    use:popperRef
    {...$$restProps}
    bind:this={inner}
    on:click
    on:click={toggle}
    aria-expanded={$context.isOpen}
    class={btnClasses}
  >
    <slot>
      <span class="visually-hidden">{ariaLabel}</span>
    </slot>
  </button>
{:else if tag === "span"}
  <span
    use:popperRef
    {...$$restProps}
    style="cursor: pointer;{$$props.style || ''}"
    bind:this={inner}
    on:click
    on:click={toggle}
    aria-expanded={$context.isOpen}
    class={classes}
  >
    <slot>
      <span class="visually-hidden">{ariaLabel}</span>
    </slot>
  </span>
{:else}
  <div
    use:popperRef
    {...$$restProps}
    style="cursor: pointer;{$$props.style || ''}"
    bind:this={inner}
    on:click
    on:click={toggle}
    aria-expanded={$context.isOpen}
    class={classes}
  >
    <slot>
      <span class="visually-hidden">{ariaLabel}</span>
    </slot>
  </div>
{/if}
