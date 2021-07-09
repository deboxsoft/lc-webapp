<script lang="ts">
  import IconArrowRight from "@deboxsoft/svelte-icons/ico/icoArrowRight3.svelte";
  import IconArrowDown from "@deboxsoft/svelte-icons/ico/icoArrowDown3.svelte";
  import CellRp from "__@comps/CellRp.svelte";

  export let account;
  export let isBalanceFixed = true;
  let expanded = false;

  function expandHandler() {
    expanded = !expanded;
  }
</script>

<tr on:click={expandHandler} style="cursor: pointer;">
  <td colspan="2" class="d-table-cell">
    <div class="d-flex flex-row align-items-center">
      {#if expanded}
        <IconArrowDown class="icon-sm pt-1 mr-1" />
      {:else}
        <IconArrowRight class="icon-sm pt-1 mr-1" />
      {/if}
      <div>
        {account.name}
      </div>
    </div>
  </td>
  <td class="d-table-cell d-xl-none">&nbsp;</td>
  <td class="d-table-cell d-md-none">&nbsp;</td>
  <td class="d-none d-md-table-cell">&nbsp;</td>
  <td class="text-right balance">
    <CellRp value={isBalanceFixed ? account.balanceFixed : account.balance} />
  </td>
  <td class="d-none d-xl-table-cell">&nbsp;</td>
</tr>
{#if account.children && expanded}
  {#each account.children as child}
    <tr class="child">
      <td style="width: 10px"></td>
      <td>- {child.name}</td>
      <td class="d-table-cell d-xl-none">&nbsp;</td>
      <td class="d-table-cell d-md-none">&nbsp;</td>
      <td class="text-right balance">
        <CellRp value={isBalanceFixed ? child.balanceFixed : child.balance} />
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