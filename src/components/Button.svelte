<script>
  export let submitting = false;
  export let disabled = false;
  export let disableMarginRight = false;
  const { class: className } = $$props;

  $: _disabled = disabled || submitting;
</script>

<button {...$$restProps} class="btn {className}" class:btn-loading={submitting} disabled={_disabled} on:click>
  {#if submitting}
    <i class="icon-spinner4 spinner" class:mr-2={!disableMarginRight} />
    proses
  {:else}
    <slot />
  {/if}
</button>
