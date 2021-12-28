<script>
  import { goto, url } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import CellNumber from "__@comps/CellNumber.svelte";
  import CellDate from "__@comps/CellDate.svelte";
  import TransactionStatus from "__@comps/transactions/TransactionStatus.svelte";
  import {getAclContext} from "../_acl-context";

  const { getCategoryInventory } = stores.getInventoryContext();
  const {removeGranted} = getAclContext();
  export let inventory;
  let dropdownContext;

  $: getCategoryInventory(inventory.categoryId);

  function selectHandler() {
    $goto("./:id/depreciation", { id: inventory.id})
  }
</script>

<tr class="cursor-pointer">
  <td style="text-align: center" on:click={selectHandler}>
    {inventory.id}
  </td>
  <td style="text-align: center" on:click={selectHandler}><CellDate date={inventory.date} /></td>
  <td style="text-align: center" on:click={selectHandler}><CellDate date={inventory.datePurchase} /></td>
  <td on:click={selectHandler}>{inventory.name || ""}</td>
  <td on:click={selectHandler}>{getCategoryInventory(inventory.categoryId)?.name || ""}</td>
  <td style="text-align: center" on:click={selectHandler}>
    <CellNumber value={inventory.totalDepreciation} />
  </td>
  <td style="text-align: center" on:click={selectHandler}>{inventory.quantity}</td>
  <td on:click={selectHandler}>
    <CellNumber value={inventory.priceItem} />
  </td>
  <td on:click={selectHandler}>
    <CellNumber value={inventory.priceItem * inventory.quantity} />
  </td>
  <td style="cursor: pointer;padding: 0">
    <Dropdown
      class="h-100 d-flex justify-content-center"
      bind:context={dropdownContext}
      menuProps={{
        offset: [0, -15]
      }}
    >
      <DropdownToggle class="list-icons-item d-flex align-items-center" tag="div">
        <i class="icon-menu9" />
      </DropdownToggle>
      <svelte:fragment slot="menu" let:closeHandler>
        <a href={$url("./:id/depreciation", { id: inventory.id })} class="dropdown-item" on:mouseup={closeHandler}
          ><i class="icon-clipboard3" />Rekap Depresiasi</a
        >
        {#if removeGranted}
          <a href={$url("./:id/remove", { id: inventory.id })} class="dropdown-item" on:mouseup={closeHandler}
            ><i class="icon-pencil" />Hapus Aktiva Tetap</a
          >
        {/if}
      </svelte:fragment>
    </Dropdown>
  </td>
</tr>
