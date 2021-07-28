<script>
  import { clsx } from "@deboxsoft/module-client";

  // props
  export let color = "inherit";
  export let size = "default";
  export let label = undefined;
  export let path = undefined;
  export let component = undefined;
  export let type = "svg";

  // state
  let { class: className } = $$props;
  let classes;

  $: classes = clsx(
    className,
    "dbx-icon",
    `-type-${type}`,
    size !== "default" && `-icon-${size}`,
    color !== "inherit" && `-color-${color}`
  );
</script>

<svelte:component this={component} {...$$restProps} class={classes} />
{#if !component}
  {#if type === "font"}
    <i aria-hidden="true" {...$$restProps} class={classes} />
  {:else if type === "svg"}
    <svg xmlns="http://www.w3.org/2000/svg" class={classes} viewBox="0 0 24 24">
      <path d={path}>
        {#if label}
          <title>{label}</title>
        {/if}
      </path>
    </svg>
  {:else}
    <slot class={classes} />
  {/if}
{/if}

<style lang="scss" global>
  .dbx-icon {
    --icon-rotate: 0;
    flex-shrink: 0;
    width: 1em;
    height: 1em;
    font-size: 1.25rem;
    color: inherit;
    user-select: none;

    &.-type-svg {
      display: inline-block;
      fill: currentColor;
    }

    &.-type-font {
      overflow: hidden;
    }

    &.-spin {
      animation: infinite dbx-icon-spin linear 1s;
    }

    &.-size-large {
      font-size: 2rem;
    }

    &.-size-small {
      font-size: 1.125rem;
    }

    &.-size-inherit {
      font-size: inherit;
    }

    > i {
      fill: currentColor;
    }
  }

  @keyframes dbx-icon-spin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
</style>
