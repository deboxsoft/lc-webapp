<script>
  import { url } from "@roxi/routify";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import AccountCell from "__@comps/account/CellAccount.svelte";
  import { getGroupDepreciation } from "@deboxsoft/accounting-api";
  import { stores } from "@deboxsoft/accounting-client";

  const { getCategoryInventory } = stores.getInventoryContext();
  export let categoryInventory;
  let dropdownContext;
</script>

<tr>
  <td>{categoryInventory.name || ""}</td>
  <td>{getGroupDepreciation(categoryInventory.groupDepreciationId)?.label || ""}</td>
  <td>
    <AccountCell id={categoryInventory.accumulatedDepreciationAccount} />
  </td>
  <td>
    <AccountCell id={categoryInventory.expenseDepreciationAccount} />
  </td>
  <td style="cursor: pointer; padding: 0">
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
        <a href={$url("./:id/depreciation", { id: categoryInventory.id })} class="dropdown-item" on:mouseup={closeHandler}
        ><i class="icon-clipboard3" />Rekap Depresiasi</a
        >
        <a href={$url("./:id/view", { id: categoryInventory.id })} class="dropdown-item" on:mouseup={closeHandler}
          ><i class="icon-eye" />Detail</a
        >
        <a href={$url("./:id/update", { id: categoryInventory.id })} class="dropdown-item" on:mouseup={closeHandler}
          ><i class="icon-trash-alt" />Edit</a
        >
        <a href={$url("./:id/remove", { id: categoryInventory.id })} class="dropdown-item" on:mouseup={closeHandler}
          ><i class="icon-pencil" />Hapus</a
        >
      </svelte:fragment>
    </Dropdown>
  </td>
</tr>
