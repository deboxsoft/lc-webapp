<script>
  import {goto} from "@roxi/routify";
  import IconArrowRight from "@deboxsoft/svelte-icons/ico/icoArrowRight3.svelte";
  import IconArrowDown from "@deboxsoft/svelte-icons/ico/icoArrowDown3.svelte";
  import CellRp from "__@comps/CellRp.svelte";

  export let account;
  export let isBalanceFixed;
  let expanded = false;

  function expandHandler() {
    expanded = !expanded;
  }

  function createTrialBalanceHandler(accountId) {
    return () => {
      $goto("./:id", { id: accountId })
    }
  }

</script>
<tr class="table-active" on:click={expandHandler} style="cursor: pointer;">
  <td class="d-table-cell" colspan="2">
    <div class="d-flex flex-row">
      <div class="align-self-center mr-1">
        <div class="arrow-icon">
          {#if expanded}
            <IconArrowDown />
          {:else}
            <IconArrowRight />
          {/if}
        </div>
      </div>
      <div>
        {account.name}
      </div>
    </div>
  </td>
  <td />
  <td class="text-right balance">
    <CellRp value={isBalanceFixed ? account.balanceFixed : account.balance} />
  </td>
</tr>
{#if account.children && expanded}
  {#each account.children as child}
    <tr class="child" style="cursor: pointer" on:click={createTrialBalanceHandler(child.id)}>
      <td style="width: 10px"></td>
      <td>- {child.name}</td>
      <td class="text-right balance">
        <CellRp value={isBalanceFixed ? child.balanceFixed : child.balance} />
      </td>
      <td />
    </tr>
  {/each}
{/if}

<style>
  .arrow-icon {
    width: 8px;
    height: 8px;
  }
  .balance {
    width: 200px;
  }
</style>
