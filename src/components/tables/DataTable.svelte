<script>
  /**
   *
   * @type {undefined | *[]}
   */
  export let items = undefined;
  export let className = $$props.class || "";
</script>

<table class="dbx-data-table table {className}">
  <slot name="scope" />
  {#if $$slots["header"]}
    <thead>
      <slot name="header" />
    </thead>
  {/if}
  <tbody>
    {#if items}
      {#each items as item}
        <slot {item}>
          <div>template, not yet implement</div>
        </slot>
      {/each}
    {:else}
      <slot />
    {/if}
  </tbody>
</table>

<style lang="scss">
  .dbx-data-table {
    height: 1px;
    width: 100%;
  }
</style>
