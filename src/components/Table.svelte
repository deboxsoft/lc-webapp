<script lang="ts">
  import InfiniteLoading from "__@comps/loader/InfiniteLoading.svelte";

  export let items: any[] | undefined = undefined;
  export let infiniteEnable = false;
</script>

<div class="dbx-table" {...$$restProps}>
  <slot name="header" />
  <div class="dbx-tbody">
    {#if items}
      {#each items as item}
        <slot {item}>
          <div>template, not yet implement</div>
        </slot>
      {/each}
    {:else}
      <slot />
    {/if}
    <div>
      {#if infiniteEnable}
        <InfiniteLoading on:infinite />
      {/if}
    </div>
  </div>
</div>

<style lang="scss" global>
  .dbx-table {
    display: flex;
    flex: 1;
    width: 100%;
    padding: 0;
    flex-direction: column;

    .dbx-thead {
      font-weight: bold;
      display: flex;
      width: 100%;
      height: 30px;
      border-bottom: 1px solid #b7b7b7;
    }

    .dbx-tbody {
      position: relative;
      display: flex;
      flex-flow: column nowrap;
      //overflow: auto;
      flex: 1;
      .dbx-tr.error {
        background-color: #e57373;
        color: #fff;
      }
      .dbx-tr:hover {
        background-color: rgba(0, 0, 0, 0.03);
        &.error {
          background-color: firebrick;
        }
      }
    }

    .dbx-tr {
      display: flex;
      padding-right: 5px;
      height: 30px;
      cursor: pointer;

      .dbx-cell {
        border-top: 1px solid #ddd;
      }
    }
    .dbx-cell {
      box-sizing: border-box;
      flex: 1 1 auto;
      padding: 0.25rem 0.5rem;
      list-style: none;
      vertical-align: middle;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;

      &.-menu-list {
        text-align: center;
        flex: 0 0 30px;
        overflow: unset;
      }

      &.-balance {
        flex: 0 0 200px;
      }
    }
  }
</style>
