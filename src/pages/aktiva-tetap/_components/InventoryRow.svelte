<script>
  import { goto, url } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import CellNumber from "__@comps/CellNumber.svelte";
  import CellDate from "__@comps/CellDate.svelte";
  import { getAclContext } from "__@root/utils";
  import { calcDepreciation } from "@deboxsoft/accounting-api";

  const { getCategoryInventory } = stores.getInventoryContext();
  const { removeGranted } = getAclContext();
  export let classes = {};
  export let inventory;
  let dropdownContext, categoryInventory, inventoryDesc;

  $: {
    categoryInventory = getCategoryInventory(inventory.categoryId);
    if (categoryInventory?.groupDepreciationId) {
      inventoryDesc = calcDepreciation({
        depreciationCount: inventory.depreciationCount || 0,
        quantity: inventory.quantity,
        priceItem: inventory.priceItem,
        groupDepreciationId: categoryInventory.groupDepreciationId
      });
    }
  }

  function selectHandler() {
    $goto("./:id/depreciation", { id: inventory.id });
  }
</script>

<tr class="cursor-pointer">
  <td class={classes.id} style="text-align: center" on:click={selectHandler}>
    {inventory.id}
  </td>
  <td class={classes.datePurchase} style="text-align: center" on:click={selectHandler}>
    <CellDate date={inventory.datePurchase} />
  </td>
  <td class={classes.name} on:click={selectHandler}>{inventory.name || ""}</td>
  <td class={classes.category} on:click={selectHandler}>{categoryInventory?.name || ""}</td>
  <td class={classes.bookValue} style="text-align: center" on:click={selectHandler}>
    <CellNumber value={inventoryDesc?.depreciationAccumulation} />
  </td>
  <td class={classes.quantity} style="text-align: center" on:click={selectHandler}>{inventory.quantity}</td>
  <td class={classes.priceItem} on:click={selectHandler}>
    <CellNumber value={inventory.priceItem} />
  </td>
  <td class={classes.total} on:click={selectHandler}>
    <CellNumber value={inventoryDesc?.total || inventory.quantity * inventory.priceItem} />
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
        <a href={$url("./:id/depreciation", { id: inventory.id })} class="dropdown-item" on:mouseup={closeHandler}>
          <i class="icon-clipboard3" />
          Rekap Depresiasi
        </a>
        {#if removeGranted}
          <a href={$url("./:id/remove", { id: inventory.id })} class="dropdown-item" on:mouseup={closeHandler}>
            <i class="icon-trash-alt" />
            Hapus Aktiva Tetap
          </a>
        {/if}
      </svelte:fragment>
    </Dropdown>
  </td>
</tr>
