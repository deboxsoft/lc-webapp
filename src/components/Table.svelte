<script lang="ts">
  import AutoSizer from "svelte-virtualized-auto-sizer";
  import List from "@deboxsoft/svelte-virtual-list";
  import InfiniteLoading from "__@comps/loader/InfiniteLoading.svelte";

  export let items: any[] = [];
  export let infiniteEnable = false;
</script>

<div class="dbx-table" {...$$restProps}>
  <slot name="header" />
  <div class="dbx-tbody">
    <AutoSizer let:height={childHeight} disableWidth>
      <List height={`${childHeight}px`} {items} let:item>
        <slot {item}>
          <div>template, not yet implement</div>
        </slot>
        <div slot="infinite">
          {#if (infiniteEnable)}
            <InfiniteLoading on:infinite />
          {/if}
        </div>
      </List>
    </AutoSizer>
  </div>
</div>

<style lang="scss" global>
  .dbx-table {
    display: block;
    width: 100%;
    margin: 0 0 3em 0;
    padding: 0;

    .dbx-thead {
      font-weight: bold;
      display: flex;
      width: 100%;
      .dbx-cell {
        border-bottom: 1px solid #b7b7b7;
      }
    }

    .dbx-tbody {
      height: 100%;
      width: 100%;
      .dbx-tr:hover {
        background-color: rgba(0, 0, 0, 0.03);
      }
    }

    .dbx-tr {
      display: flex;
      padding-right: 5px;

      .dbx-cell {
        border-top: 1px solid #ddd;
      }
    }
    .dbx-cell {
      box-sizing: border-box;
      flex-grow: 1;
      width: 100%;
      padding: 0.25rem 0.5rem;
      list-style: none;
      vertical-align: middle;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;

      &.-menu-list {
        overflow: unset;
      }
    }
  }
</style>
