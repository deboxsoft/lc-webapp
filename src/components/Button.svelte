<script>
  export let submitting = false;
  export let disabled = false;
  const { class: className } = $$props;

  $: _disabled = disabled || submitting;
</script>

<button {...$$restProps} class="button {className}" class:btn-loading={submitting} disabled={_disabled} on:click>
  {#if submitting}
    <i class="icon-spinner4 spinner mr-2" />
    proses
  {:else}
    <slot />
  {/if}
</button>
