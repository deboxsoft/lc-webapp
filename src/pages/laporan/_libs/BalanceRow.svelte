<script>
  import IconArrowRight from "@deboxsoft/svelte-icons/ico/IcoArrowRight3Icon.svelte";
  import IconArrowDown from "@deboxsoft/svelte-icons/ico/IcoArrowDown3Icon.svelte";
  import CellNumber from "__@comps/CellNumber.svelte";
  import { writable } from "svelte/store";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  export let account;
  export let toggle;
  export let isExpand = () => writable(false);
  $: expanded = isExpand(account.id);

  function createSelectChildAccountHandler(account) {
    return () => {
      dispatch("select", account);
    };
  }
</script>

<tr on:click={toggle(account.id)} class="cursor-pointer">
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
    <tr class="child cursor-pointer">
      <td style="width: 10px" on:click={createSelectChildAccountHandler(child)} />
      <td style="padding-left: 1.25rem" on:click={createSelectChildAccountHandler(child)}>
        {child.name}
        <div class="text-muted font-size-sm">
          {child.id}
        </div>
      </td>
      <td class="d-table-cell d-xl-none" on:click={createSelectChildAccountHandler(child)}>&nbsp;</td>
      <td class="d-table-cell d-md-none" on:click={createSelectChildAccountHandler(child)}>&nbsp;</td>
      <td class="text-right balance" on:click={createSelectChildAccountHandler(child)}>
        <CellNumber value={child.balance} />
      </td>
      <td class="d-none d-md-table-cell" on:click={createSelectChildAccountHandler(child)}>&nbsp;</td>
      <td class="d-none d-xl-table-cell" on:click={createSelectChildAccountHandler(child)}>&nbsp;</td>
    </tr>
  {/each}
{/if}

<style>
  .balance {
    width: 200px;
  }
</style>
