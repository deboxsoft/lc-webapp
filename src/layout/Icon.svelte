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

<style lang="scss" global src="./styles/icon.scss">
</style>

<svelte:component this={component} {...$$restProps} class={classes} />
{#if !component}
  {#if type === 'font'}
    <i aria-hidden="true" {...$$restProps} class={classes} />
  {:else if type === 'svg'}
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
