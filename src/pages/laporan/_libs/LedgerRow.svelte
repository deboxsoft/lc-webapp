<script>
  import { goto } from "@roxi/routify";
  import IconArrowRight from "@deboxsoft/svelte-icons/ico/IcoArrowRight3Icon.svelte";
  import IconArrowDown from "@deboxsoft/svelte-icons/ico/IcoArrowDown3Icon.svelte";
  import CellNumber from "__@comps/CellNumber.svelte";

  /**
   * @type{AccountBalance}
   */
  export let accountBalance;
  export let toggle;
  export let linkDisable = false;
  export let isExpand = () => writable(false);
  $: expanded = isExpand(accountBalance.id);

  function createDetailBalanceHandler(accountId) {
    return () => {
      if (!linkDisable) {
        $goto("./:id", { id: accountId });
      }
    };
  }
</script>

<tr class="table-active" on:click={toggle(accountBalance.id)} style="cursor: pointer;">
  <td class="d-table-cell" colspan="2">
    <div class="d-flex flex-row align-items-center">
      {#if $expanded}
        <IconArrowDown class="icon-sm pt-1 mr-1" />
      {:else}
        <IconArrowRight class="icon-sm pt-1 mr-1" />
      {/if}
      <div>
        {accountBalance.name}
        <div class="text-muted font-size-sm">
          {accountBalance.id}
        </div>
      </div>
    </div>
  </td>
  <td />
  <td class="text-right balance">
    <CellNumber value={accountBalance.balance} />
  </td>
</tr>
{#if accountBalance.children && $expanded}
  {#each accountBalance.children as child}
    <tr class="child" style={!linkDisable ? "cursor: pointer" : ""} on:click={createDetailBalanceHandler(child.id)}>
      <td style="width: 10px" />
      <td
        >{child.name}
        <div class="text-muted font-size-sm">
          {child.id}
        </div>
      </td>
      <td class="text-right balance">
        <CellNumber value={child.balance} />
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
