<script>
  import IconArrowRight from "@deboxsoft/svelte-icons/ico/icoArrowRight3.svelte";
  import IconArrowDown from "@deboxsoft/svelte-icons/ico/icoArrowDown3.svelte";
  import CellNumber from "__@comps/CellNumber.svelte";
  import { writable } from "svelte/store";

  export let account;
  export let toggle;
  export let isExpand = () => writable(false);
  $: expanded = isExpand(account.id);
</script>

<tr on:click={toggle(account.id)} style="cursor: pointer;">
  <td colspan="2" class="d-table-cell">
    <div class="d-flex flex-row align-items-center">
      {#if $expanded}
        <IconArrowDown class="icon-sm pt-1 mr-1" />
      {:else}
        <IconArrowRight class="icon-sm pt-1 mr-1" />
      {/if}
      <div>
        {account.name}
        <div class="text-muted font-size-sm">
          {account.id}
        </div>
      </div>
    </div>
  </td>
  <td class="d-table-cell d-xl-none">&nbsp;</td>
  <td class="d-table-cell d-md-none">&nbsp;</td>
  <td class="d-none d-md-table-cell">&nbsp;</td>
  <td class="text-right balance">
    <CellNumber value={account.balance} />
  </td>
  <td class="d-none d-xl-table-cell">&nbsp;</td>
</tr>
{#if account.children && $expanded}
  {#each account.children as child}
    <tr class="child">
      <td style="width: 10px"></td>
      <td style="padding-left: 1.25rem">
        {child.name}
        <div class="text-muted font-size-sm">
          {account.id}
        </div>
      </td>
      <td class="d-table-cell d-xl-none">&nbsp;</td>
      <td class="d-table-cell d-md-none">&nbsp;</td>
      <td class="text-right balance">
        <CellNumber value={child.balance} />
      </td>
      <td class="d-none d-md-table-cell">&nbsp;</td>
      <td class="d-none d-xl-table-cell">&nbsp;</td>
    </tr>
  {/each}
{/if}

<style>
  .balance {
    width: 200px;
  }
</style>