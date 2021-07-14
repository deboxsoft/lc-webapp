<script>
  import { goto } from "@roxi/routify";
  import IconArrowRight from "@deboxsoft/svelte-icons/ico/icoArrowRight3.svelte";
  import IconArrowDown from "@deboxsoft/svelte-icons/ico/icoArrowDown3.svelte";
  import CellRp from "__@comps/CellRp.svelte";

  export let account;
  export let isBalanceFixed;
  export let toggle;
  export let isExpand = () => writable(false);
  $: expanded = isExpand(account.id);

  function createTrialBalanceHandler(accountId) {
    return () => {
      $goto("./:id", { id: accountId });
    };
  }
</script>

<tr class="table-active" on:click={toggle(account.id)} style="cursor: pointer;">
  <td class="d-table-cell" colspan="2">
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
  <td />
  <td class="text-right balance">
    <CellRp value={isBalanceFixed ? account.balanceFixed : account.balance} />
  </td>
</tr>
{#if account.children && $expanded}
  {#each account.children as child}
    <tr class="child" style="cursor: pointer" on:click={createTrialBalanceHandler(child.id)}>
      <td style="width: 10px" />
      <td>{child.name}
        <div class="text-muted font-size-sm">
          {account.id}
        </div>
      </td>
      <td class="text-right balance">
        <CellRp value={isBalanceFixed ? child.balanceFixed : child.balance} />
      </td>
      <td />
    </tr>
  {/each}
{/if}

<style>
  .balance {
    width: 200px;
  }
</style>
